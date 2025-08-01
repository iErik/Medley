import { type EnhancedStore } from '@reduxjs/toolkit'

import { decodeTime } from 'ulid'
import { call, put, takeLatest } from 'typed-redux-saga'

import {
  type Events,
  User as ApiUser,
  Chat,
} from '@ierik/revolt'

import { delta } from '@/revolt'

import type { User, Asset } from '@store/shared/types'
import { mapUser, mapAsset } from '@store/shared/transform'

import { type ReduxAction, createSlice } from '@utils/redux'


/*--------------------------------------------------------/
/ -> Types                                                /
/--------------------------------------------------------*/

export type Message = Chat.RevoltMessage & {
  createdAt: number
  serverId?: string
}

export type DirectChannel = Chat.DirectMessage & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

export type GroupChannel = Chat.GroupChannel & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

export type SavedMessages = Chat.SavedMessage & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

export type TextChannel = Chat.TextChannel & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

// TODO: VoiceChannel doesn't need these properties, but
// we're including it here for consistency and so that
// TypeScript leaves alone, but we need to revise it
export type VoiceChannel = Chat.VoiceChannel & {
  fetched: boolean
  loading: boolean
  messages: Message[]
}

export type Channel
  = DirectChannel
  | GroupChannel
  | SavedMessages
  | TextChannel
  | VoiceChannel


export type ServerChannel
  = TextChannel
  | Chat.VoiceChannel

export type Server = Omit<
  Chat.RevoltServer, 'icon' | 'banner'> & {
  lastSelectedChannel: string | null
  icon: Asset | null
  banner: Asset | null
}

export type UserRelationship = ApiUser.RelationshipType
export type ServerCategory = Chat.ServerCategory

// TODO: Maybe use Pick in here?
export type UserRelationshipType
  = 'Friend'
  | 'Outgoing'
  | 'Incoming'
  | 'Blocked'
  | 'BlockedOther'

export type UserRelationships = {
  [key in UserRelationshipType]: string[]
};

export type Member = ApiUser.RevoltMember & {
  fullId: string
}

export type ActiveChannel = {
  id: string
  serverId: string
  typing: Array<any>
  loading: boolean
  messageCount: number
}

export type ChatState = {
  activeChannel: ActiveChannel
  activeServer: string | null

  channels: Record<string, Channel>
  servers: Record<string, Server>
  members: Record<string, Member>
  users: Record<string, User>

  relationships: UserRelationships
}

// Mapped Types
// ---------------

export type MCategory = Omit<
  Chat.ServerCategory,
  'channels'
> & {
  channels: ServerChannel[]
}

export type MServer = Omit<
  Server,
  'categories'
> & { categories: MCategory[] }

// Re-exports

const ChannelType = Chat.ChannelType
const RelationshipTypeEnum = ApiUser.RelationshipTypeEnum
const UserPresenceEnum = ApiUser.UserPresenceEnum

export {
  ChannelType,
  RelationshipTypeEnum,
  UserPresenceEnum
}

/*--------------------------------------------------------/
/ -> Helpers                                              /
/--------------------------------------------------------*/

export const getMemberFullId = (
  { _id }: ApiUser.RevoltMember
): string => `${_id.server}-${_id.user}`

export const isDirect = (c: Channel): c is DirectChannel =>
  c.channel_type === ChannelType.DirectMessage

export const isGroup = ({ channel_type }: Channel) =>
  channel_type === ChannelType.Group

export const isSavedMsgs = ({ channel_type }: Channel) =>
  channel_type === ChannelType.SavedMessages


/*--------------------------------------------------------/
/ -> Reducer                                              /
/--------------------------------------------------------*/

const initialState: ChatState = {
  activeServer: null,
  activeChannel: {
    id: '',
    serverId: '',
    loading: false,
    typing: [],
    messageCount: 0
  },

  channels: {},
  servers: {},
  members: {},
  users: {},

  relationships: {
    Friend: [],
    Outgoing: [],
    Incoming: [],
    Blocked: [],
    BlockedOther: []
  }
}

const { types, actions, rootReducer } = createSlice({
  name: 'user',
  state: initialState,
  reducers: {
    setActiveServer(state, activeServer: string | null) {
      state.activeServer = activeServer
    },

    setActiveChannel(
      state,
      channelId: string,
      serverId: string
    ) {
      state.activeChannel.id = channelId
      state.activeChannel.serverId = serverId
    },

    setServers(state, servers: Server[]) {
      for (const server of servers) {
        state.servers[server._id] = server
      }
    },

    setChannels(state, channels: Channel[]) {
      for (const channel of channels) {
        state.channels[channel._id] = channel
      }
    },

    setLoadingChannel(
      state,
      channelId: string,
      loading: boolean
    ) {
      let target = state.channels[channelId]
      if (!target) return

      target.loading = loading
    },

    setFetched(state, channelId: string, fetched = true) {
      const channel = state.channels[channelId]
      const isVoice =
        channel?.channel_type === ChannelType.Voice

      if (channel && !isVoice) {
        channel.fetched = fetched
      }
    },

    setChannel(
      state,
      channelId: string,
      channel: Partial<Channel>
    ) {
      let target = state.channels[channelId]

      if (!target) return

      target = {
        ...target,
        // TODO: no bueno
        // Option 1: Make it so that the caller *has* to
        // inform the type of the channel in advance
        // Option 2: Write a 'merge' helper which will only
        // merge already existing properties
        ...(channel || {}) as typeof target
      }
    },

    appendMessages(
      state,
      messages: Chat.RevoltMessage[],
      channelId: string,
      serverId?: string,
    ) {
      const channel = state.channels[channelId]
      const isVoice =
        channel?.channel_type === ChannelType.Voice

      if (!channel || isVoice) return

      const existingMessageIds = channel.messages
        .map(msg => msg._id)
      const newMessages = (messages || [])
        .filter(msg => !existingMessageIds.includes(msg._id))
        .reverse()

        const mapMsg = (message: Chat.RevoltMessage) => ({
          ...message,
          ...(serverId ? { serverId } : {}),
          createdAt: decodeTime(message._id)
        })

      channel.messages = [
        ...newMessages,
        ...channel.messages,
      ].map(mapMsg)

      if (channelId === state.activeChannel.id)
        state.activeChannel.messageCount = channel.messages
          .length
    },

    setRelationshipList(
      state,
      type: UserRelationshipType,
      list: string[]
    ) {
      if (type in state.relationships) {
        state.relationships[type] = [ ...(list || []) ]
      }
    },

    setMembers(state, members: ApiUser.RevoltMember[]) {
      for (const member of members) {
        const fullId = getMemberFullId(member)
        state.members[fullId] = {
          ...member,
          fullId
        }
      }
    },

    setMember(state, member: ApiUser.RevoltMember) {
      const fullId = getMemberFullId(member)
      state.members[fullId] = {
        ...member,
        fullId
      }
    },

    setUsers(state, users: User[]) {
      for (const user of users) {
        state.users[user.id] = user
      }
    },

    setUser(state, user: User) {
      if (user.id && (user.id in state.users)) {
        const target = state.users[user.id]
        state.users[user.id] = { ...target, ...user }
      }
    },
  },
  actions: {
    selectChannel(channelId: string, serverId?: string) {
      return {
        channelId,
        serverId
      }
    }
  }
})

export { actions, types }
export default rootReducer

/*--------------------------------------------------------/
/ -> Mapping Functions                                    /
/--------------------------------------------------------*/

export const filterRelationship = (
  users: User[],
  type: ApiUser.RelationshipType
): string[] => users
  .filter(u => u.relationship === type)
  .map(u => u.id)


/*--------------------------------------------------------/
/ -> Bonfire Event Handlers                               /
/--------------------------------------------------------*/

export const bonfireListeners = {
  Ready: (
    store: EnhancedStore,
    { users, members, ...data }: Events.ReadyEvent
  ) => {
    const mapped = users.map(mapUser)

    const servers = data?.servers?.map(server => ({
      ...server,
      lastSelectedChannel: null,
      icon: mapAsset(server.icon),
      banner: mapAsset(server.banner)
    }))

    const channels = data?.channels?.map(channel => ({
      ...channel,
      fetched: false,
      loading: false,
      messages: []
    }))

    store.dispatch(actions.setServers(servers))
    store.dispatch(actions.setChannels(channels))

    store.dispatch(actions.setUsers(mapped))
    store.dispatch(actions.setMembers(members))

    // -> Fill up user relationships map
    store.dispatch(actions.setRelationshipList('Friend',
      filterRelationship(mapped, 'Friend')
    ))

    store.dispatch(actions.setRelationshipList('Blocked',
      filterRelationship(mapped, 'Blocked')
    ))

    store.dispatch(actions.setRelationshipList('Incoming',
      filterRelationship(mapped, 'Incoming')
    ))

    store.dispatch(actions.setRelationshipList('Outgoing',
      filterRelationship(mapped, 'Outgoing')
    ))
  }
}

/*--------------------------------------------------------/
/ -> Saga                                                 /
/--------------------------------------------------------*/


function* onSetActiveServer ({ args }: ReduxAction<{
  activeServer: string
}>) {
  const [ , data ] = yield* call(
    delta.servers.getMembers,
    args?.activeServer
  )

  yield* put(actions.setMembers(data?.members))
  yield* put(actions.setUsers(data?.users?.map(mapUser)))
}

type SelectChannelParams = ReduxAction<{
  channelId: string,
  serverId: string
}>

function* onSelectChannel ({ args }: SelectChannelParams) {
  yield* put(actions.setLoadingChannel(
    args.channelId,
    true))

  const [ , data ] = yield* call(
    delta.channels.getMessages,
    args.channelId,
    { include_users: true })

  yield* put(actions.setFetched(args.channelId, true))

  if (data.type === 'IncludeUsers') {
    yield* put(actions.setMembers(data.members || []))
    yield* put(actions.setUsers(
      (data.users || []).map(mapUser)
    ))
  }

  yield* put(actions.appendMessages(
    data.messages,
    args.channelId,
    args.serverId))

  yield* put(actions.setLoadingChannel(
    args.channelId,
    false))
}


export function* chatSaga() {
  yield* takeLatest(
    types.setActiveServer,
    onSetActiveServer
  )

  yield* takeLatest(types.selectChannel, onSelectChannel)
}


export * from './getters'
