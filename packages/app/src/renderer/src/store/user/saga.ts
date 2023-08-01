import {
  call,
  put,
  takeEvery,
  take,
  spawn
} from 'typed-redux-saga'

import { types, actions, AuthState } from '@store/user'
import { delta, bonfire } from '@/revolt'

function* loginHandler (
  credentials: { email: string, password: string }
) {
  put(actions.setLoading(true))
  const [ err, data ] = yield* call(
    delta.auth.login,
    credentials)
  put(actions.setLoading(false))

  if (err)
    yield* put(actions.setErrors([ 'Oops, something went wrong' ]))

  if (
    data?.result === 'MFA' &&
    data?.allowed_methods.includes('Totp')
  ) yield* put(actions.authState(AuthState.PendingMFA))

  if (data?.token)
    yield* put(actions.authState(AuthState.Authenticated, data))

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

  if (err) yield* put(actions.setErrors([
      'Oops, something went wrong'
  ]))
  else if (data?.token)
    yield* put(actions.authState(
      AuthState.Authenticated,
      data
    ))
}

function* loginFlow () {
  while (true) {
    const { args: { credentials } } = yield take(types.login)
    const { ticket } = yield call(loginHandler, credentials)

    const { args: { code } } = yield take(types.mfa)
    yield call(mfaHandler, code, ticket)

    yield take(types.logout)
  }
}

function* fetchUserData ({ args }: ReduxAction) {
  if (args?.authState !== AuthState.Authenticated)
    return

  yield* call(bonfire.connect)
}

export default function* userSaga() {
  yield spawn(loginFlow)
  // yield takeEvery(types.authState, fetchUserData)
}
