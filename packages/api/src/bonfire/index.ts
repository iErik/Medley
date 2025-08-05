import {
  secondsToMs,
  executeMap
} from '@ierik/ts-utils'

import { ClientEvent, ServerEvent } from '@/types/Bonfire'
import type {
  BonfireEvent,
  BonfireListener
} from '@/types/Bonfire'

import type {
  ClientContext,
  ContextSetter,
  BonfireSocket
} from '@/types/Client'

// -> Types
// --------

enum WSReadyState {
  Connecting = 0,
  Open       = 1,
  Closing    = 2,
  Closed     = 3,
}

// -> Module definition
// --------------------

const Bonfire = (
  clientContext: ClientContext,
  setContext: ContextSetter
) => {
  const PING_INTERVAL = secondsToMs(15)
  const { VITE_BONFIRE_API: BONFIRE_API } = import.meta.env


  const setSocket = (socket: Partial<BonfireSocket>) =>
    setContext({
      socket: {
        ...(clientContext.socket || {}),
        ...(socket || {})
      }
    })

  const destroyConnection = () => {
    const socket = clientContext?.socket
    const pingIntervalId = socket?.pingIntervalId
    const connection = socket?.connection

    if (!connection || !socket.active) return
    if (pingIntervalId) clearInterval(pingIntervalId)

    connection.close()

    setSocket({
      active: false,
      connection: null,
      pingIntervalId: null
    })
  }

  const sendMsg = (msg: BonfireEvent) => {
    const connection = clientContext?.socket?.connection
    if (connection) connection.send(JSON.stringify(msg))
  }

  const onEvent = (
    evName: ServerEvent,
    listener: BonfireListener
  ) => {
    const socket = clientContext?.socket
    const listeners = socket?.eventListeners

    if (!socket) return

    setSocket({
      eventListeners: {
        ...(listeners || {}),
        [evName]: [
          ...(listeners?.[evName] || []),
          listener
        ]
      }
    })
  }

  const onMsg = (listener: BonfireListener) => {
    const socket = clientContext?.socket
    const catchallListeners = socket?.catchallListeners

    if (!socket) return

    setSocket({
      catchallListeners: [
        ...(catchallListeners || []),
        listener
      ]
    })
  }

  const sendPing = () => sendMsg({
    type: ClientEvent.Ping,
    data: Date.now()
  })

  const beginPing = () => setTimeout(() => {
    const socket = clientContext?.socket
    const connection = clientContext?.socket?.connection

    if (!connection || !socket?.active) return

    const deadConnection = [
      WSReadyState.Closing,
      WSReadyState.Closed
    ].includes(connection.readyState)

    if (deadConnection) return destroyConnection()

    sendPing()
    const pingIntervalId = setInterval(
      sendPing,
      PING_INTERVAL)

    setSocket({ pingIntervalId })
  })

  const connect = () => {
    const connectionUrl = [
      BONFIRE_API,
      `&token=${clientContext?.token}`
    ].join('')

    const connection = new WebSocket(connectionUrl)

    connection.addEventListener('open', () => beginPing())

    connection.addEventListener('message', (message) => {
      const socket = clientContext?.socket
      const contents = JSON.parse(message?.data || '')
      const { type: eventType } = contents || {}

      const eventMap = {
        ...Object.entries(socket?.eventListeners || {})
          .reduce((acc, [ evName, listeners ]) => ({
            ...acc,
            [evName]: (contents: any, message: string) =>
              listeners.forEach((listener: BonfireListener) =>
                listener(contents, message))
          }), {})
      }

      executeMap(eventMap, eventType, [ contents, message ])

      if (socket && socket?.catchallListeners?.length)
        socket?.catchallListeners
          .forEach((listener: BonfireListener) =>
            listener(contents, message))
    })

    setSocket({ connection })
  }

  const initialSocketState: BonfireSocket = {
    connection: null,
    active: false,
    pingIntervalId: null,
    eventListeners: {},
    catchallListeners: [],
    connect
  }

  setSocket(initialSocketState)

  return {
    sendMsg,
    onMsg,
    onEvent,
    connect,
    destroyConnection,
  }
}

export default Bonfire
