import {
  call,
  put,
  takeEvery,
  take,
  spawn
} from 'typed-redux-saga'

import { types, actions, AuthState } from '@store/user'
import { auth, user, gateway } from '@ierik/discordance-api'

function* loginHandler (
  credentials: { email: string, password: string }
) {
  put(actions.setLoading(true))
  const [ err, data ] = yield* call(
    auth.login,
    credentials)
  put(actions.setLoading(false))

  if (err)
    yield* put(actions.setErrors([ 'Oops, something went wrong' ]))
  else if (data?.mfa)
    yield* put(actions.authState(AuthState.PendingMFA))
  else if (data?.token)
    yield* put(actions.authState(AuthState.Authenticated, data))

  return data || {}
}

function* mfaHandler (code: string, ticket: string) {
  if (!code || !ticket) return

  put(actions.setLoading(true))
  const [ err, data ] = yield* call(
    auth.multiFactor,
    code,
    ticket)
  put(actions.setLoading(false))

  if (err)
    yield* put(actions.setErrors([
      'Oops, something went wrong'
    ]))
  else if (data?.token)
    yield* put(actions.authState(
      AuthState.Authenticated,
      data
    ))
}

function* logoutHandler () {

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

  const [ err, data ] = yield* call(user.getUserInfo)

  if (err) {

  } else {
    yield* put(actions.userData(data))
    yield* call(gateway.initSocket)
  }
}

export default function* userSaga() {
  yield spawn(loginFlow)
  yield takeEvery(types.authState, fetchUserData)
}
