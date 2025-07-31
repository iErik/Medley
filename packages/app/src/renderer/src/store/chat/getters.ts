import { useAction } from '@hooks'
import { useSelector } from '@store'

import { Chat } from '@ierik/revolt'
import type * as StateTypes from './types'
import { actions } from './reducer'

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

export function useServer(
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

export function useCategory(categoryId: string) {
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

export function useChannel(channelId: string) {
  const channel = useSelector(state =>
    state.chat.channels[channelId])

  return channel
}

export function useMessages(
  channelId: string,
  fetch?: boolean
): StateTypes.Message[] {
  const channel = useChannel(channelId)

  if (!channel) return []

  const selectChannel = useAction(actions.selectChannel)

  if (!channel?.fetched && fetch) {
    selectChannel(channel._id)
  }

  return channel?.messages || []
}

export function useDirectMessages(): Chat.DirectMessage[] {
  const directs = useSelector(state => {
    const directs = Object
      .values(state.chat.channels)
      .filter(c =>
        c.channel_type === Chat.ChannelType.DirectMessage)

    return directs as Chat.DirectMessage[]
  })

  return directs
}

export function useActiveChannel() {
  const activeChannelId = useSelector(state =>
    state.chat.activeChannel?.id)
  const channel = useChannel((activeChannelId))
  const messages = useMessages(activeChannelId)

  if (!channel) return null

  return { channel, messages }
}
