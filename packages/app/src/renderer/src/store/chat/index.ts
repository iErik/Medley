import { createReducer } from '@utils/redux'
import { bonfire } from '@/revolt'
import type { Chat, Events } from '@ierik/revolt'

import { useDispatch } from '@store'

// -> Type Aliases
// ---------------

// -> Types
// --------

type MappedServer = Chat.RevoltServer & {
  channels: Chat.RevoltChannel
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
}, 'chat')

// -> Mappers
// ----------

const mapServerChannels = (
  { servers, channels }: Events.ReadyEvent
) => servers.map((server) => ({
  ...server,
  channels: server.channels.map(channel => channels
    .find(ch => ch._id === channel))
}))

// -> WS Event Handlers
// --------------------

bonfire.onEvent('Ready', (data: Events.ReadyEvent) => {

})

export { actions, types }
export default rootReducer
