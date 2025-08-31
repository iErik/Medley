import { createSelector } from '@reduxjs/toolkit'

import { useAction } from '@hooks'
import { type RootState, useSelector } from '@store'
import type { User } from '@store/shared/types'

import {
  type UserRelationshipType,
  type DirectChannel,
  type GroupChannel,
  type MServer,
  type Channel,
  type ServerChannel,
  type Message,
  type ServerCategory,
  ChannelType,
  actions
} from './'


/*--------------------------------------------------------/
/ -> Types                                                /
/--------------------------------------------------------*/

export type MDirectChannel = DirectChannel & {
  userId: string
  user: User
}

export type MUserRelationships = {
  [key in UserRelationshipType]: User
}

export type MGroupChannel = Omit<
  GroupChannel,
  'recipients'
> & {
  recipients: User[]
}

/*--------------------------------------------------------/
/ -> Helpers                                              /
/--------------------------------------------------------*/

export const isDirect = (c: Channel): c is DirectChannel =>
  c.channel_type === ChannelType.DirectMessage

export const isGroup = (c: Channel): c is GroupChannel =>
  c.channel_type === ChannelType.Group

export const isSavedMsgs = ({ channel_type }: Channel) =>
  channel_type === ChannelType.SavedMessages


/*--------------------------------------------------------/
/ -> Selectors                                            /
/--------------------------------------------------------*/

export const selectDMs = createSelector(
  [ (state: RootState) => state.chat.channels ],
  (channels) => Object
    .values(channels)
    .filter(isDirect))


export const selectActiveDMs = createSelector(
  [ selectDMs ],
  (channels) => channels.filter(c => c.active))


export const selectDMsWithUsers = createSelector(
  [
    selectActiveDMs,
    (state: RootState) => state.chat.users,
    (state: RootState) => state.auth.self.id
  ],
  (channels, users, selfId) => channels
    .map((c) => {
      const userId = c.recipients.find(r => r !== selfId)

      return {
        ...c,
        userId,
        user: userId ? users[userId] : null
      }
    })
    .filter((c): c is MDirectChannel =>
      !!c.user && !!c.userId))

export const selectGroupChannels = createSelector(
  [
    (state: RootState) => state.chat.channels,
    (state: RootState) => state.chat.users,
  ],
  (channels, users) => Object
    .values(channels)
    .filter(isGroup)
    .map((channel): MGroupChannel => ({
      ...channel,
      recipients: channel.recipients.map(id => users[id])
    })))


export const selectServerWithChannels = createSelector(
  [
    (state: RootState) => state.chat.servers,
    (state: RootState) => state.chat.channels,
    (_, args: { serverId: string }) =>
      args.serverId
  ],
  (servers, channels, serverId): MServer | null => {
    const server = servers[serverId]
    if (!server) return null

    let serverChannels: Record<string, ServerChannel> =
      (server.channels || []).reduce((acc, channelId) => ({
        ...acc,
        ...(channels[channelId]
          ? { [channelId]: channels[channelId] }
          : {})
      }), {})

    const serverCategories = (server.categories || [])
      .map(cat => ({
        ...cat,
        channels: (cat.channels || [])
          .map(channelId => {
            const {
              [channelId]: channel,
              ...rest
            } = serverChannels

            // Revise this
            serverChannels = rest
            return channel
          })
          .filter(channel => !!channel)
      }))

    return {
      ...server,
      uncategorized: Object.values(serverChannels),
      categories: serverCategories
    }
  }
)

export const selectUserRelationship = createSelector(
  [
    (state: RootState) => state.chat.users,
    (state: RootState) => state.chat.relationships,
    (_, { type }: { type: UserRelationshipType }) => type
  ],
  (users, relationships, type) =>
    (relationships[type] || []).map(userId => users[userId])
)

export const selectUserRelationships = createSelector(
  [
    (state: RootState) => state.chat.users,
    (state: RootState) => state.chat.relationships,
  ],
  (users, relationships) => Object
    .entries(relationships)
    .reduce((acc, [name, values]) => ({
      ...acc,
      [name]: (values || []).map(userId => users[userId])
    }), {} as PopulatedUserRelationships)
)


type SelectCategoryArgs = {
  categoryId: string,
  serverId?: string
}
export const selectCategory = createSelector(
  [
    (state: RootState) => state.chat.channels,
    (state: RootState) => state.chat.servers,
    (_, args: SelectCategoryArgs) => args
  ],
  (channels, servers, args) => {
    let category: ServerCategory | undefined

    if (args.serverId) {
      category = (servers[args.serverId]?.categories || [])
        .find(c => c.id === args.categoryId)
    } else {
      category = Object.values(servers)
        ?.flatMap(({ categories }) => categories)
        ?.find(({ id }) => id === args.categoryId)
    }

    return {
      category,
      channels: (category?.channels || []).map(channelId =>
        channels[channelId] as ServerChannel)
    }
  }
)

export const selectServerChannels = createSelector(
  [

  ],
  () => {

  }
)

/*--------------------------------------------------------/
/ -> Getters                                              /
/--------------------------------------------------------*/


export function useUser(userId: string, serverId?: string) {
  const user = useSelector(state =>
    state.chat.users[userId])

  const memberId = serverId ? `${serverId}-${userId}` : null
  const member = memberId
    ? useSelector(state => state.chat.members[memberId])
    : null

  if (!user) return { user: null, member: null }

  return {
    user,
    member
  }
}

// TODO: Revise
export function useRole(roleId: string) {
  const activeServer = useSelector(state =>
    state.chat.activeServer)

  if (!activeServer) return null

  const guild = useSelector(state =>
    state.chat.servers[activeServer])
  const role = (guild?.roles || {})[roleId]

  return role
}

export function useRelationship(type: UserRelationshipType) {
  return useSelector(state => selectUserRelationship(
    state,
    { type }
  ))
}

export function useServer(
  serverId: string
): MServer | null {
  return useSelector(state => selectServerWithChannels(
    state,
    { serverId }
  ))
}

export function useCategory(
  categoryId: string,
  serverId?: string
): {
  category: ServerCategory | undefined,
  channels: ServerChannel[]
} {
  return useSelector(state => selectCategory(
    state,
    { categoryId, serverId }
  ))
}

export function useChannel(channelId: string): Channel {
  const channel = useSelector(state =>
    state.chat.channels[channelId])

  return channel
}

export function useMessages(
  channelId: string,
  fetch?: boolean
): Message[] {
  const channel = useChannel(channelId)
  if (!channel) return []

  const selectChannel = useAction(actions.selectChannel)

  if (
    !channel?.fetched &&
    !channel?.loading &&
    fetch
  ) { selectChannel(channel._id) }

  return channel?.messages || []
}

export function useDirectMessages(): DirectChannel[] {
  return useSelector(selectDMs)
}

export function useActiveChannel() {
  const activeChannelId = useSelector(state =>
    state.chat.activeChannel?.id)
  const channel = useChannel((activeChannelId))
  const messages = useMessages(activeChannelId)

  if (!channel) return null

  return { channel, messages }
}

