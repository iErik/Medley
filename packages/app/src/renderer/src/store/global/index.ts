import { createReducer } from '@utils/redux'
import { bonfire } from '@/revolt'
import type { Chat, Events } from '@ierik/revolt'

// -> Type Aliases
// ---------------

// -> Types
// --------


type GlobalState = {
  isLoading: boolean
  //userMentions: UserMention[]
  users: any
}

// -> Store Definition
// -------------------

const initialState: GlobalState = {
  isLoading: false,
  //userMentions: [],
  users: {}
}

const {
  types,
  actions,
  rootReducer
} = createReducer<GlobalState>(initialState, {
})

// -> Mappers
// ----------

const mapServerChannels = (
  { servers, channels }: Events.ReadyEvent
) =>
  servers.map((server) => ({
    ...server,
    channels: server.channels.map(channel => channels
      .find(ch => ch._id === channel))
  }))

// -> WS Event Handlers
// --------------------

bonfire.onEvent('Ready', (data: Events.ReadyEvent) => {
  console.log('Ready: ', { data })
})

export { actions, types }
export default rootReducer
