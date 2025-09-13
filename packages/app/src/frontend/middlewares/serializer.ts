import { get } from '@packages/ts-utils'

import { Middleware } from 'redux'

import { serializeStore } from '@utils/redux'

/**
 * Example usage:
 *
 * Will return a reference to an object with
 * an property 'nested' which is an object containing a
 * property named 'property' whose value is 0:
 *
 * setObj({}, 'nested.property', 0)
 *
 * Will return a reference to an object with
 * an property 'nested' which is an object containing a
 * property named 'list' whose value is a list with the
 * first value of the list being the string 'a':
 *
 * setObj({}, 'nested.list[0]', 'a')
 */

const setObj = (
  target: Record<string, any>,
  path: string,
  value: any
): Record<string, any> => {
  if (!path) return target

  // Split path into tokens, handling array indices
  const segments = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)

  let current: any = target

  for (let i = 0; i < segments.length; i++) {
    const key = segments[i]
    const isLast = i === segments.length - 1

    if (isLast) {
      current[key] = value
    } else {
      // If next key looks like a number, we should prepare
      // an array
      const nextKey = segments[i + 1]
      const shouldBeArray = /^\d+$/.test(nextKey)

      if (!(key in current)) {
        current[key] = shouldBeArray ? [] : {}
      }

      current = current[key]
    }
  }

  return target
}

// TODO: Study Redux Persist's implementation
// TODO: Avoid unecessary LocalStorage API calls
const mkSerializer = (stateKeys: string[]): Middleware =>
  store => next => action => {
    const state = store.getState()

    const filteredState = stateKeys.reduce(
      (acc, key: string) =>
        setObj(acc, key, get(state, key))
      ,{})

    serializeStore(filteredState)
    next(action)
  }

export default mkSerializer
