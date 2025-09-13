import { isType } from '@packages/ts-utils'

import Bonfire from '@bonfire'
//import * as delta from '@delta'
import * as delta from './delta'

import type {
  ContextPartial,
  ClientContext,
} from '@/types/Client'


type GenericDeltaAPI<T = typeof delta> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? ReturnType<T[K]>
    : never
  /*
  [K in keyof T]: T[K] extends (...args: any[]) => infer R
    ? R
    : never
    */
}

type BoundClient = {
  bonfire: ReturnType<typeof Bonfire>
  delta: GenericDeltaAPI<typeof delta>
}

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
 * @param options.cache - Makes it so the clientContext state
 * object gets saved onto the localStorage after every change
 * and such state is also recovered when the client is re-created
 *
 * @param options.autoConnect - Will attempt to initiate the
 * bonfire websocket connection whenever the user authetication
 * token becomes available in the clientContext
 *
 * @returns
 */
const createClient = (
  options: ClientOptions = {}
): BoundClient => {
  // What is the return type?
  const getCache = () => {
    const serializedState = localStorage
      .getItem('revoltClientCtx' || 'null')
    const parsedState = serializedState
      ? JSON.parse(serializedState) as ClientContext
      : { token: '', socket: null }

      return parsedState
  }

  type BoundDeltaAPI = GenericDeltaAPI<typeof delta>

  // What does this do?
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
      const currentValue = clientContext[key as keyof ClientContext]

      if (isType(currentValue, 'Object')) deepMerge(
        ((clientContext as Record<string, any>)[key] || {}),
        value as Record<string, any>)
      else
        (clientContext as Record<string, any>)[key] = value
    })

    if (options?.cache) cacheContext(clientContext)
  }

  const boundClient = {
    bonfire: Bonfire(clientContext, setContext),
    delta: Object
      .entries(delta)
      .reduce<BoundDeltaAPI>((acc, [ key, value ]) => ({
        ...acc,
        [key]: value(clientContext, setContext)
      }), {} as BoundDeltaAPI)
  }

  if (
    options?.autoConnect &&
    clientContext?.token &&
    clientContext?.socket?.connect
  ) clientContext?.socket?.connect()

  return boundClient
}

export default createClient
