import { all } from 'redux-saga/effects'

import globalSaga from '@store/global/saga'
import { authSaga }  from '@store/auth'
import { chatSaga } from '@store/chat'

export default function* rootSaga() {
  yield all([
    globalSaga(),
    authSaga(),
    chatSaga()
  ])
}
