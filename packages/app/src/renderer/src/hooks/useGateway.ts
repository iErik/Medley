import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { AnyAction } from 'redux'

import {
  gatewayListeners as chatListeners
} from '@store/chat'

import {
  gatewayListeners as globalListeners
} from '@store/global'

import {
  AuthState,
  actions as userActions,
  gatewayListeners as userListeners
} from '@store/user'

import {
  gateway,
  auth,
  ReceiveEvent
} from '@ierik/discordance-api'

const {
  hasConnection,
  initSocket,
  destroySocket
} = gateway

const { hasToken, getAuthData } = auth
const { authState: setAuthState }  = userActions

const useGateway = (authState: AuthState) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const isAuthenticated =
      authState === AuthState.Authenticated

    if (hasToken() && !isAuthenticated) dispatch(
      setAuthState(
        AuthState.Authenticated,
        getAuthData()
      ))

    if (!isAuthenticated) return destroySocket()
    if (isAuthenticated && hasConnection()) return

    const {
      bindEvent,
      destroyConnection
    } = initSocket()

    const dispatchAll = (actions: Array<AnyAction>) =>
      actions.forEach(action => dispatch(action))

    type EventMap = {
      [key in ReceiveEvent]: Function
    }

    const handlerHoist = (listener: Function) =>
      (data: any) => dispatchAll(listener(data))

    const bindEvents = (eventMap: EventMap) => Object
      .entries(eventMap)
      .forEach(([ eventName, listener ]) =>
        bindEvent(eventName, handlerHoist(listener)))

    bindEvents(userListeners)
    bindEvents(chatListeners)
    bindEvents(globalListeners)

    return destroyConnection
  }, [ authState ])
}

export default useGateway
