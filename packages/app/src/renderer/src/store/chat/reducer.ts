import { decodeTime } from 'ulid'

import {
  type Events,
  type Chat,
  getAssetUrl
} from '@ierik/revolt'

import { createSlice } from '@utils/redux'
import {
  type Server,
  type Channel,
  ChannelType
} from './types'


// -> Types
// --------

type ActiveChannel = {
  id: string
  serverId: string
  typing: Array<any>
  loading: boolean
  messageCount: number
}

type ChatState = {
  activeChannel: ActiveChannel
  activeServer: string | null

  // We should prolly keep all channels in a single
  // collection, that way, whenever Channel events come
  // through the WebSocket we don't have to guess in which
  // collection the relevant channel is stored. Ideally we
  // Channel collection should be flat
  channels: Record<string, Channel>
  servers: Record<string, Server>
}

// -> Store Definition
// -------------------

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
}

const {
  types,
  actions,
  rootReducer
} = createSlice({
  name: 'chat',
  state: initialState,
  reducers: {
    setActiveServer(state, activeServer: string | null) {
      state.activeServer = activeServer
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

    setActiveChannel(
      state,
      channelId: string,
      serverId: string
    ) {
      state.activeChannel.id = channelId
      state.activeChannel.serverId = serverId
    },

    setLoadingChannel(
      state,
      channelId: string,
      loading: boolean
    ) {
      let target = state.channels[channelId]

      if (!target) return

      target.loading = loading
      //state.activeChannel.loading = loading
    },

    prependMessages(
      state,
      messages: Chat.RevoltMessage,
      channelId
    ) {

    },

    appendMessages(
      state,
      messages: Chat.RevoltMessage[],
      channelId: string,
      serverId?: string,
    ) {
      console.log('STORE: APPENDING MESSAGES...')
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

      console.log('STORE: MESSAGES APPENDED!')
    }
  },
  actions: {
    selectChannel(channelId: string, serverId?: string) {
      return {
        channelId,
        serverId
      }
    }
  },
})

// -> WS Event Handlers
// --------------------

const bonfireListeners = {
  Ready: (store, data: Events.ReadyEvent) => {
    const servers = data?.servers?.map(server => ({
      ...server,
      icon: {
        ...(server?.icon || {}),
        src: server?.icon || server?.icon?._id
          ? getAssetUrl(server?.icon?.tag, server?.icon?._id)
          : null
      },
      banner: {
        ...(server?.banner || {}),
        src: getAssetUrl(
          server?.banner?.tag,
          server?.banner?._id
        )
      },
    }))

    const channels = data?.channels?.map(channel => ({
      ...channel,
      fetched: false,
      loading: false,
      messages: []
    }))

    store.dispatch(actions.setServers(servers))
    store.dispatch(actions.setChannels(channels))
  }
}

export { actions, types, bonfireListeners }
export default rootReducer
