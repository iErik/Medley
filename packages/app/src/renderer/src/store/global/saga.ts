import {
  takeLeading,
  call,
  put,
} from 'typed-redux-saga'

import { types, actions } from '@store/global'
import { user } from '@ierik/discordance-api'

type FetchUserParams = ReduxAction<{ userId: string }>
function* onFetchUser ({ args }: FetchUserParams) {
  yield* put(actions.addMention(args.userId))

  const [ err, data ] = yield* call(
    user.getUser,
    args)

  if (err) yield* put(actions.setMention({
    id: args.userId,
  }))

  else yield* put(actions.setMention(data))
}

export default function* globalSaga() {
  yield takeLeading(types.fetchUser, onFetchUser)
}
