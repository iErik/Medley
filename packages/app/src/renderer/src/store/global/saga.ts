import {
  takeLeading,
  call,
  put,
} from 'typed-redux-saga'

import { types, actions } from '@store/global'
import { delta } from '@/revolt'

import { getAssetUrl } from '@ierik/revolt'
import type { User } from '@ierik/revolt'

const mapUser = (user: User.RevoltUser) => ({
  ...(user || {}),
  avatar: {
    ...(user?.avatar || {}),
    src: getAssetUrl(user?.avatar?.tag, user?.avatar?._id)
  },
  profile: {
    ...(user?.profile || {}),
    background: {
      ...(user?.profile?.background || {}),
      src: getAssetUrl(
        user?.profile?.background.tag,
        user?.profile?.background._id,
      )
    }
  }
})

type FetchUserParams = ReduxAction<{ userId: string }>
function* onFetchUser ({ args }: FetchUserParams) {
  yield* put(actions.addMention(args.userId))

  const [ err, data ] = yield* call(
    delta.users.getUser,
    args?.userId)

  if (err) yield* put(actions.setMention({
    _id: args.userId,
    loading: false,
    user: null
  }))

  else yield* put(actions.setMention({
    id: args?.userId,
    loading: false,
    user: mapUser(data)
  }))
}

export default function* globalSaga() {
  yield takeLeading(types.fetchUser, onFetchUser)
}
