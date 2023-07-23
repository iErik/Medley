import { all } from 'redux-saga/effects'

import globalSaga from '@store/global/saga'
import userSaga from '@store/user/saga'
import chatSaga from '@store/chat/saga'

export default function* rootSaga() {
  yield all([
    globalSaga(),
    userSaga(),
    chatSaga()
  ])
}
