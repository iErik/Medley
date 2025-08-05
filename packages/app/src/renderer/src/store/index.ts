import { useCallback } from 'react'
import { configureStore } from '@reduxjs/toolkit'

import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux'

import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'

import serializer from '@middlewares/serializer'
import bindBonfire from '@store/connectBonfire'

import {
  loadSerializedStore,
  hasPreloadedState
} from '@utils/redux'


import rootSaga from '@store/rootSaga'

import authReducer, {
  bonfireListeners as authBonfireListeners
} from '@store/auth'

import chatReducer, {
  bonfireListeners as chatBonfireListeners
} from '@store/chat'

import globalReducer, {
  bonfireListeners as globalBonfireListeners
} from '@store/global'



const sagaMiddleware = createSagaMiddleware()


const store = configureStore({
  reducer: {
    global: globalReducer,
    auth: authReducer,
    chat: chatReducer
  },

  middleware: (defaultMiddlewares) =>
    defaultMiddlewares({
      serializableCheck: false
    }).concat(sagaMiddleware, serializer, /*logger*/),

  ...(hasPreloadedState()
     ? { preloadedState: loadSerializedStore() }
     : { }),

  devTools: true
})

sagaMiddleware.run(rootSaga)

bindBonfire(store, [
  authBonfireListeners,
  chatBonfireListeners,
  globalBonfireListeners
])



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type DispatchFunc = () => AppDispatch

export const useDispatch: DispatchFunc = useReduxDispatch
export const useSelector: TypedUseSelectorHook<RootState> =
  useReduxSelector

export default store
