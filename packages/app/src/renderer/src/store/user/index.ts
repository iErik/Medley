import { createReducer } from '@utils/redux'
import { bonfire } from '@/revolt'
import type { Events } from '@ierik/revolt'

// -> Type Aliases
// ----------------

type UserRelationshipsMap = User.UserRelationshipsMap

// -> Types
// --------

export enum AuthState {
  Unauthenticated = 'UNAUTHENTHICATED',
  PendingMFA      = 'PENDING_MFA',
  Authenticated   = 'AUTHENTICATED'
}

type UserState = {
  authState: AuthState
  isLoading: boolean
  errors: string[]

  userId: string
  userSettings: object

  relationships: UserRelationshipsMap
}

type HandlerArgs = Record<string, any>

// Helpers
// -------

const genericHandler = <UserState>(
  state: UserState,
  args: HandlerArgs
) => ({ ...state, ...args })


// -> Store Definition
// -------------------

const initialState: UserState = {
  authState: AuthState.Unauthenticated,
  isLoading: false,
  errors: [],

  userId: '',
  userSettings: {},

  relationships: {
    friends: [],
    blocked: [],
    pendingOutgoing: [],
    pendingIncoming: []
  }
}

const {
  types,
  actions,
  rootReducer
} = createReducer<UserState>(initialState, {
  login: { args: [ 'credentials' ] },
  mfa: { args: [ 'code' ] },
  logout: { args: [] },

  setLoading: {
    args: [ 'isLoading' ],
    handler: genericHandler
  },

  authState: {
    args: [ 'authState', 'authData' ],
    handler: <UserState>(
      state: UserState,
      { authState, authData }: HandlerArgs
    ) => ({
      ...state,
      authState,
      userSettings: authData?.user_settings || {},
      userId: authData?.user_id || ''
    })
  },
}, 'user')

// -> Mappers
// ----------

// -> WS Event handlers
// --------------------

bonfire.onEvent('Ready', (data: Events.ReadyEvent) => {

})

export { actions, types }
export default rootReducer
