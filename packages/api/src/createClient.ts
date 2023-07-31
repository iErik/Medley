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

const createClient = () => {
  var clientContext: ClientContext = {
    token: '',
    socket: null
  }

  const setContext = (context: ContextPartial) => {
    console.log('setContext: ', { context, clientContext })
    Object.entries(context).forEach(([ key, value ]) => {
      const currentValue = clientContext[key]

      if (isType(currentValue, 'Object')) deepMerge(
        ((clientContext as Record<string, any>)[key] || {}),
        value as Record<string, any>)
      else
        (clientContext as Record<string, any>)[key] = value

      /*
      if (isType(value, 'Object')) deepMerge(
        ((clientContext as Record<string, any>)[key] || {}),
        value as Record<string, any>)
      else
        (clientContext as Record<string, any>)[key] = value
      */
    })
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
