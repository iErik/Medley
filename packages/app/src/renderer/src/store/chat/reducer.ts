import { decodeTime } from 'ulid'

import { createReducer } from '@utils/redux'
import { getAssetUrl } from '@ierik/revolt'
import type { Common, Chat, Events, User } from '@ierik/revolt'

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
  privateMessages: PrivateChannel[]
  servers: Server[]
  channels: ServerChannel[]
  members: Member[]
  users: User.RevoltUser[]
}

type HandlerArgs = Record<string, any>

// -> Helpers
// ----------

const genericHandler = <ChatState>(
  state: ChatState,
  args: HandlerArgs
) => ({ ...state, ...args })

// -> Store Definition
// -------------------

const initialState: ChatState = {
  activeChannel: {
    id: '',
    serverId: '',
    loading: false,
    typing: [],
    messageCount: 0
  },

  activeServer: null,

  privateMessages: [],
  servers: [],
  channels: [],
  members: [],
  users: []
}

const {
  types,
  actions,
  rootReducer
} = createReducer<ChatState>(initialState, {
  selectChannel: { args: [ 'channelId', 'serverId' ] },

  setServers: {
    args: [ 'servers' ],
    handler: genericHandler
  },

  setChannels: {
    args: [ 'channels' ],
    handler: genericHandler
  },

  setActiveServer: {
    args: [ 'activeServer' ],
    handler: genericHandler
  },

  setUsers: {
    args: [ 'users' ],
    handler: (
      state: ChatState,
      { users }: { users: User.RevoltUser[] }
    ) => {
      state.users = [
        ...state.users,
        ...users.filter(({ _id }) =>
          !state.users.find(u => u._id === _id))
      ]
    }
  },

  setMembers: {
    args: [ 'members' ],
    handler: (
      state: ChatState,
      { members }: { members: User.RevoltMember[] }
    ) => {
      state.members = [
        ...state.members,
        ...members
          .filter(({ _id }) => {
            const fullId = `${_id.server}-${_id.user}`
            return !state.members.find(m => m.fullId === fullId)
          })
          .map(m => ({
            ...m,
            fullId: `${m._id.server}-${m._id.user}`
          }))
      ]
    }
  },

  setActiveChannel: {
    args: [ 'channelId', 'serverId' ],
    handler: (
      state: ChatState,
      { channelId, serverId }: HandlerArgs
    ) => {
      state.activeChannel.id = channelId
      state.activeChannel.serverId = serverId
    }
  },

  setLoadingChannel:  {
    args: [ 'loading' ],
    handler: (
      state: ChatState,
      { loading }: HandlerArgs
    ) => {
      state.activeChannel.loading = loading
    }
  },

  appendMessages: {
    args: [ 'messages', 'serverId', 'channelId' ],
    handler: (
      state: ChatState,
      { messages, serverId, channelId }: {
        messages: Chat.RevoltMessage[]
        serverId: string
        channelId: string
      }
    ) => {
      const channel = state.channels
        ?.find(channel => channel._id === channelId)

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
    }
  },

}, 'chat')

// -> WS Event Handlers
// --------------------

const bonfireEvents = {
  Ready: (data: Events.ReadyEvent) => {
    console.log({ data })

    const servers = data?.servers?.map(server => ({
      ...server,
      icon: {
        ...(server?.icon || {}),
        src: getAssetUrl(server?.icon?.tag, server?.icon?._id)
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
      messages: []
    }))

    return [
      actions.setServers(servers),
      actions.setChannels(channels)
    ]
  }
}

export { actions, types, bonfireEvents }
export default rootReducer
