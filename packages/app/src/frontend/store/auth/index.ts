import { type EnhancedStore } from '@reduxjs/toolkit'
import {
  call,
  put,
  take,
  takeEvery,
  spawn
} from 'typed-redux-saga'

import { type Events } from '@ierik/revolt'
import { delta } from '@/revolt'

import type { User } from '@store/shared/types'
import { mapUser } from '@store/shared/transform'

import { createSlice } from '@utils/redux'

/*--------------------------------------------------------/
/ -> Types                                                /
/--------------------------------------------------------*/

export enum AuthStage {
  Unauthenticated = 'UNAUTHENTHICATED',
  PendingMFA      = 'PENDING_MFA',
  Authenticated   = 'AUTHENTICATED'
}

export type UserCredentials = {
  email: string,
  password: string
}

export type Self = Omit<User, 'id'> & {
  id: string | null
}

export type AuthState = {
  authStage: AuthStage
  isLoading: boolean
  errors: string[]

  self: Self
}

/*--------------------------------------------------------/
/ -> Reducer                                              /
/--------------------------------------------------------*/

const initialState: AuthState = {
  authStage: AuthStage.Unauthenticated,
  isLoading: false,
  errors: [],

  self: {
    displayName: null,
    discriminator: null,
    status: null,
    username: null,
    id: null,
    avatar: null,
    relationship: 'User'
  }
}

const { types, actions, rootReducer } = createSlice({
  name: 'auth',
  state: initialState,
  actions: {
    login: (credentials: UserCredentials) => ({
      credentials
    }),
    mfa: (code: string) => ({ code }),
    logout: null
  },
  reducers: {
    setSelf(state, self: User) {
      state.self = { ...state.self, ...self }
    },

    authStage(
      state,
      authStage: AuthStage,
      authData?: { user_id: string }
    ) {
      state.authStage = authStage
      state.self.id = authData?.user_id || state.self.id
    },

    setLoading(state, loading: boolean) {
      state.isLoading = loading
    },

    setErrors(state, errors: string[]) {
      state.errors = [
        ...state.errors,
        ...errors
      ]
    },
  }
})

export { actions, types }
export default rootReducer

/*--------------------------------------------------------/
/ -> Bonfire Event Handlers                               /
/--------------------------------------------------------*/

export const bonfireListeners = {
  Ready: async (
    store: EnhancedStore,
    { users }: Events.ReadyEvent
  ) => {
    const mapped = await Promise.all(users.map(mapUser))

    const user = mapped.find(u => u.relationship === 'User')

    if (user) store.dispatch(actions.setSelf(user))
  }
}

/*--------------------------------------------------------/
/ -> Saga                                                 /
/--------------------------------------------------------*/

function* loginHandler(credentials: UserCredentials) {
  put(actions.setLoading(true))
  const [ err, data ] = yield* call(
    delta.auth.login,
    credentials)
  put(actions.setLoading(false))

  if (err) {
    yield* put(actions.setErrors([
      'Oops, something went wrong'
    ]))
  }

  if (
    data?.result === 'MFA' &&
    data?.allowed_methods.includes('Totp')
  ) yield* put(actions.authStage(AuthStage.PendingMFA))

  if (data.result === 'Success' && data?.token)
    yield* put(actions.authStage(
      AuthStage.Authenticated, data))

  return data || {}
}

function* mfaHandler (code: string, ticket: string) {
  if (!code || !ticket) return

  put(actions.setLoading(true))
  const [ err, data ] = yield* call(delta.auth.login, {
    mfa_ticket: ticket,
    mfa_response: { totp_code: code }
  })

  put(actions.setLoading(false))

  if (err) {
    // TODO: Create error helper fn
    yield* put(actions.setErrors([
      'Oops, something went wrong'
    ]))
  } else if (data.result === 'Success' && data?.token) {
    yield* put(actions.authStage(
      AuthStage.Authenticated,
      data
    ))
  }
}

function* loginFlow () {
  while (true) {
    const { args: { credentials } } = yield take(types.login)
    const { ticket } = yield call(loginHandler, credentials)

    if (ticket) {
      const { args: { code } } = yield take(types.mfa)
      yield call(mfaHandler, code, ticket)
    }

    yield take(types.logout)
  }
}

function watchAuthStage (args: any) {
  console.log('AuthStage:', { args })
}

export function* authSaga() {
  yield spawn(loginFlow)
  yield takeEvery(types.authStage, watchAuthStage)
}


export * from './getters'
