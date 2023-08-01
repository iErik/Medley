import { createReducer } from '@utils/redux'
import { getAssetUrl } from '@ierik/revolt'
import type { Common, Chat, Events } from '@ierik/revolt'


// -> Type Aliases
// ---------------

// -> Types
// --------

type MappedAsset = Common.Asset & {
  src: string
}

type MappedServer = Chat.RevoltServer & {
  channels: Chat.RevoltChannel
  icon: MappedAsset
}

type ActiveChannel = {
  id: string
  guildId: string
  typing: Array<any>
  loading: boolean
  messageCount: number
}

type ChatState = {
  isLoading: boolean
  activeChannel: ActiveChannel
  privateMessages: any[]
  servers: MappedServer[]
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
  isLoading: false,

  activeChannel: {
    id: '',
    guildId: '',
    loading: false,
    typing: [],
    messageCount: 0
  },

  privateMessages: [],
  servers: [],
}

const {
  types,
  actions,
  rootReducer
} = createReducer<ChatState>(initialState, {
  setServers: {
    args: [ 'servers' ],
    handler: genericHandler
  },
}, 'chat')

// -> Types
// --------


// -> WS Event Handlers
// --------------------

const bonfireEvents = {
  Ready: (data: Events.ReadyEvent) => {
    const servers = data?.servers?.map((server) => ({
      ...server,
      icon: {
        ...(server?.icon || {}),
        src: getAssetUrl(server?.icon?.tag, server?.icon?._id)
      },
      channels: server.channels.map(channel => data?.channels
        ?.find(ch => ch._id === channel))
    }))

    return [ actions.setServers(servers) ]
  }
}

export { actions, types, bonfireEvents }
export default rootReducer
