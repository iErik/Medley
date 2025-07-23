import { useSelector } from '@store'

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
  const server = useSelector(state =>
    state.chat.servers[serverId])

  if (!server) return null

  return {
    ...server,
    categories: server.categories?.map(cat => ({
      ...cat,
      channels: (cat?.channels || [])
        .map(channelId => channels[channelId])
        .filter(channel => !!channel) as
          StateTypes.ServerChannel[]
    }))
  }
}

export function useCategory (categoryId: string) {
  const channels = useSelector(state => state.chat.channels)

  const category = useSelector(state => {
    const category = Object.values(state.chat.servers)
      ?.flatMap(({ categories }) => categories)
      ?.find(({ id }) => categoryId === id)

    return {
      category,
      channels: category?.channels
        ?.map(channelId => channels[channelId])
    }
  })

  return category
}

export function useChannel (channelId: string) {
  const channel = useSelector(state =>
    state.chat.channels[channelId])

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
