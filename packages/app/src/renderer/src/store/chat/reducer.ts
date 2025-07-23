import { decodeTime } from 'ulid'

//import { createReducer } from '@utils/redux'
import { createSlice } from '@utils/redux'
import {
  getAssetUrl,
  type Common,
  type Chat,
  type Events,
  type User
} from '@ierik/revolt'

// -> Types
// --------

export type Member = User.RevoltMember & {
  fullId: string
}

export type Asset = Common.Asset & {
  src: string
}

export type Message = Chat.RevoltMessage & {
  createdAt: Date
  serverId: string
}

export type ServerChannel = Chat.ServerChannel & {
  messages: Message[]
}

export type PrivateChannel = Chat.DirectMessage & {
  messages: Message[]
}

export type Channel = ServerChannel | PrivateChannel

export type Server = Chat.RevoltServer & {
  icon: Asset
  banner: Asset
}

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

    setChannels(state, channels: ServerChannel[]) {
      for (const channel of channels) {
        state.channels[channel._id] = channel
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

    setLoadingChannel(state, loading: boolean) {
      state.activeChannel.loading = loading
    },

    appendMessages(
      state,
      messages: Chat.RevoltMessage[],
      serverId: string,
      channelId: string
    ) {
      console.log('STORE: APPENDING MESSAGES...')
      const channel = state.channels[channelId]

      if (!channel) return

      const existingMessageIds = channel.messages
        .map(msg => msg._id)
      const newMessages = (messages || [])
        .filter(msg => !existingMessageIds.includes(msg._id))
        .reverse()

        const mapMsg = (message: Chat.RevoltMessage) => ({
          ...message,
          serverId,
          createdAt: new Date(decodeTime(message._id))
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
    selectChannel(channelId: string, serverId: string) {
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
      messages: [] as Message[]
    }))

    store.dispatch(actions.setServers(servers))
    store.dispatch(actions.setChannels(channels))
  }
}

export { actions, types, bonfireListeners }
export default rootReducer
