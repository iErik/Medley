import { useSelector } from '@store'
import { decodeTime } from 'ulid'
import { getAssetUrl } from '@ierik/revolt'

import type { Chat } from '@ierik/revolt'
import type * as StateTypes from './reducer'

// -> Types
// --------

export type PopulatedCategory = Omit<Chat.ServerCategory,
  'channels'
> & {
  channels: StateTypes.ServerChannel[]
}

export type PopulatedServer = Omit<StateTypes.Server,
  'categories'
> & {
  categories: PopulatedCategory[]
}

// -> Hooks
// --------

export function useServer (
  serverId: string
): PopulatedServer | null {
  const channels = useSelector(state => state.chat.channels)
  const server = useSelector(state => state.chat.servers
    ?.find(({ _id }) => serverId === _id))

  if (!server) return null

  const getChannel = (channelId: string) => channels
    ?.find(({ _id }) => channelId === _id)

  return {
    ...server,
    categories: server.categories?.map(cat => ({
      ...cat,
      channels: (cat?.channels || [])
        .map(channelId => getChannel(channelId))
        .filter(channel => !!channel) as
          StateTypes.ServerChannel[]
    }))
  }
}

export function useCategory (categoryId: string) {
  const channels = useSelector(state => state.chat.channels)
  const category = useSelector(state => {
    const category = state.chat.servers
      ?.flatMap(({ categories }) => categories)
      ?.find(({ id }) => categoryId === id)

    return {
      category,
      channels: category?.channels
        ?.map(channelId => channels
        ?.find(({ _id }) => channelId === _id))
    }
  })

  return category
}

export function useChannel (channelId: string) {
  const channel = useSelector(state => state.chat.channels
    ?.find(({ _id }) => channelId === _id))

  return channel
}

export function useMessages (channelId: string) {
  const channel = useChannel(channelId)

  return (channel?.messages || []).map(msg => ({
    ...msg,
    createdAt: new Date(msg.createdAt)
  }))
}

export function useActiveChannel () {
  const activeChannelId = useSelector(state =>
    state.chat.activeChannel?.id)
  const channel = useChannel((activeChannelId))
  const messages = useMessages(activeChannelId)

  if (!channel) return null

  return { channel, messages }
}

export function useUser (userId: string, serverId?: string) {
  const user = useSelector(state => state.chat.users
    ?.find(u => u?._id === userId))
  const member = !serverId
    ? null
    : useSelector(state => state.chat.members?.find(m => {
      const fullId = `${serverId}-${userId}`
      return m?.fullId === fullId
    }))

  if (!user) return { user: null, member: null }

  return {
    user: {
      ...(user || {}),
      avatar: {
        ...(user?.avatar || {}),
        src: getAssetUrl(user?.avatar?.tag, user?.avatar?._id)
      }
    },
    member
  }
}
