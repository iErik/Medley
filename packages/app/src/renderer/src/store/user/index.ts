import { createReducer } from '@utils/redux'
import {
  ReceiveEvent,
  User
} from '@ierik/discordance-api'

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

  setErrors: {
    args: [ 'errors' ],
    handler: genericHandler
  },

  setRelationships: {
    args: [ 'relationships' ],
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

  userData: {
    args: [ 'userData' ],
    handler: <UserState>(
      state: UserState,
      { userData }: HandlerArgs
    ) => ({
      ...state,
      connections: [ ...(userData?.connections || []) ],
      relationships: { ...(userData?.relationships || {}) }
    })
  }
}, 'user')

export const gatewayListeners = {
  [ReceiveEvent.Ready]: ({ relationships } = {}) => [
    actions.setRelationships(relationships)
  ]
}

export { actions, types }
export default rootReducer
