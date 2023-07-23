import { configureStore } from '@reduxjs/toolkit'
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux'

import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'

import rootSaga from '@store/rootSaga'
import userReducer from '@store/user'
import chatReducer from '@store/chat'
import globalReducer from '@store/global'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer: {
    global: globalReducer,
    user: userReducer,
    chat: chatReducer
  },

  middleware: [
    sagaMiddleware,
    logger
  ],

  devTools: true
})

sagaMiddleware.run(rootSaga)

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type DispatchFunc = () => AppDispatch

export const useDispatch: DispatchFunc = useReduxDispatch
export const useSelector: TypedUseSelectorHook<RootState> =
  useReduxSelector
