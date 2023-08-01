import { isType } from '@ierik/ts-utils'

import Bonfire from '@bonfire'
import * as delta from '@delta'

import type {
  ContextPartial,
  ClientContext,
} from '@typings/Client'

const deepMerge = (
  objA: Record<string, any>,
  objB: Record<string, any>
) => Object
  .entries(objB)
  .forEach(([ key, value ]) => {
    if (isType(value, 'Object'))
      deepMerge((objA?.[key] || {}), value)
    else
      objA[key] = value
  })

type ClientOptions = {
  cache?: boolean
  autoConnect?: boolean
}

/**
 * @param options.cache
 * @param options.autoConnect
 *
 * @returns
 */
const createClient = (options: ClientOptions = {}) => {
  const getCache = () => {
    const serializedState = localStorage
      .getItem('revoltClientCtx' || 'null')
    const parsedState = serializedState
      ? JSON.parse(serializedState) as ClientContext
      : { token: '', socket: null }

      return parsedState
  }

  const cacheContext = (context: ClientContext) => {
    const { socket: _, ...serializable } = context
    const savedState = localStorage
      .getItem('revoltClientCtx')
      const serializedState = JSON.stringify({
        ...(serializable || {}),
        socket: null
      })

    if (savedState === serializedState) return

    localStorage.setItem('revoltClientCtx', serializedState)
  }

  const proxyHandler = {
    set (
      ctx: ClientContext,
      prop: string,
      value: any,
      receiver: Record<string, any>
    ) {
      const operationStatus = Reflect
        .set(ctx, prop, value, receiver)

      if (
        prop === 'token' &&
        value &&
        !ctx?.socket?.active &&
        options?.autoConnect &&
        ctx?.socket?.connect
      ) ctx?.socket?.connect()

      return operationStatus
    }
  }

  var contextObj: ClientContext  = options?.cache
    ? getCache()
    : { token: '', socket: null }

  var clientContext: ClientContext = new Proxy<ClientContext>(
    contextObj,
    proxyHandler)

  const setContext = (context: ContextPartial) => {
    Object.entries(context).forEach(([ key, value ]) => {
      const currentValue = clientContext[key]

      if (isType(currentValue, 'Object')) deepMerge(
        ((clientContext as Record<string, any>)[key] || {}),
        value as Record<string, any>)
      else
        (clientContext as Record<string, any>)[key] = value
    })

    if (options?.cache) cacheContext(clientContext)
  }

  return {
    bonfire: Bonfire(clientContext, setContext),
    delta: Object
      .entries(delta)
      .reduce((acc, [ key, value ]) => ({
        ...acc,
        [key]: value(clientContext, setContext)
      }), {})
  }
}

export default createClient
