import type {
  Reducer as RootReducer,
  UnknownAction
} from 'redux'

import produce, { type Immutable } from 'immer'
import { camelToSnake } from '@utils/helpers'


export interface ReduxAction<
  T = Record<string, any>
> extends UnknownAction {
  type: string
  args: T
}


type Reducer<StateType> = (
  state: StateType,
  ...args: any
) => StateType | void

type ProducedReducer<StateType> = (
  state: StateType,
  ...args: any
) => StateType


interface StoreReducersDef<StateType> {
  [reducerName: string]: Reducer<StateType>
}

interface StoreActionsDef {
  [actionName: string]: null | ((...a: any) =>
    Record<string, any> | null | void)
}

type StoreActions<S, T> = {
  [K in keyof T]: T[K] extends (state: S, ...args: infer A) => any
    ? (...args: A) => { type: string; args: A }
    : never
}

// Do we really need this?
type StoreCustomActions<T extends StoreActionsDef> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => { type: string; args: R }
    : () => { type: string; args: Record<string, never> }
}

interface StoreDefinition<
  StateType,
  R extends StoreReducersDef<StateType>,
  A extends StoreActionsDef
> {
  name: string
  state: StateType
  actions?: A
  reducers: R
}

interface ReduxStore<
  StateType,
  R,
  A extends StoreActionsDef
>  {
  types: { [K in keyof R]: string } & { [K in keyof A]: string }
  actions: StoreActions<StateType, R> & StoreCustomActions<A>
  rootReducer: RootReducer<StateType, UnknownAction>

  reducers: {
    [K in keyof R as string]: ProducedReducer<StateType>
  }
}



const inspectFnArgs = <S>(fn: Reducer<S>): string[] => {
  const fnStr = fn.toString()
  const match = fnStr.match(/^[^(]*\(([^)]*)\)/)

  if (!match) return []

  const argNames = match[1]
    .split(',')
    .map(param => param.trim())
    .filter(Boolean)

  // The first reducer argument is always going to be the
  // store State, so we remove it.
  argNames.shift()

  return argNames
}

const mapFnArgs = <S>(
  fn: Reducer<S>,
  args: any[]
): Record<string, any> => {
  const argNames = inspectFnArgs(fn)

  return argNames.reduce((acc, argName, idx) => ({
    ...acc,
    [argName]: args[idx] || null
  }), {})

}

const wrapReducer = <S>(name: string, fn: Reducer<S>) => {
  const fnArgs = inspectFnArgs(fn)
  const curried = produce(fn)

  return (st: Immutable<S>, args: Record<string, any>) => {
    const mappedArgs: any[] = fnArgs.map(arg => {
      if (arg in args)
        return args[arg]

      console.error(
        `REDUCER ERROR: Argument ${arg} of the reducer ` +
        `${name} is missing!`
      )

      return null
    })

    return curried(st, ...mappedArgs)
  }
}

export const createSlice = <
  StateType,
  R extends StoreReducersDef<StateType>,
  A extends StoreActionsDef
>(store: StoreDefinition<StateType, R, A>):
  ReduxStore< StateType, R, A > =>
{
  const getType = (reducerName: string) => store.name
    ? `${store.name}/${camelToSnake(reducerName).toUpperCase()}`
    : camelToSnake(reducerName).toUpperCase()


  type ComputedReducers = {
    types: { [K in keyof R]: string }
    actions: StoreActions<StateType, R>
    reducers: {
      [K in keyof R as string]: ProducedReducer<StateType>
    },
  }

  const { types, actions, reducers } = Object
    .entries(store.reducers)
    .reduce<ComputedReducers>((acc, [ name, fn ]) => ({
      types: {
        ...acc.types,
        [name]: getType(name)
      },
      actions: {
        ...acc.actions,
        [name]: (...args: any[]) => ({
          type: getType(name),
          args: mapFnArgs(fn, args),
        })
      },
      reducers: {
        ...acc.reducers,
        [getType(name)]: wrapReducer(name, fn)
      }
    }), {
      types: {},
      actions: {},
      reducers: {}
    } as ComputedReducers)

  const { extraActions, extraTypes } = Object
    .entries(store.actions || {})
    .reduce((acc, [ name, fn ]) => ({
      extraActions: {
        ...acc.extraActions,
        [name]: (...args: any[]) => ({
          type: getType(name),
          args: fn ? fn(...args) : {}
        })
      },
      extraTypes: {
        ...acc.extraTypes,
        [name]: getType(name)
      }
    }), {
      extraActions: {} as StoreCustomActions<A>,
      extraTypes: {} as Record<keyof A, string>
    })

  const rootReducer = (
    state: StateType = store.state,
    action: UnknownAction
  ): StateType => {
    return action.type in reducers
      ? reducers[action.type](state, action?.args)
      : state
  }

  return {
    types: { ...types, ...extraTypes },
    actions: { ...actions, ...extraActions },
    rootReducer,
    reducers
  }
}


/**
 *
 * @param store
 * @returns
 */
export const serializeStore = (
  store: Record<string, any>
) => {
  const savedState = localStorage.getItem('storeState')
  const serializedStore = JSON.stringify(store)

  if (savedState === serializedStore) return

  localStorage.setItem('storeState', serializedStore)
}

export const hasPreloadedState = () =>
  !!localStorage.getItem('storeState')

/**
 *
 * @returns
 */
export const loadSerializedStore = <T>(): T | null => {
  const serializedState = localStorage.getItem('storeState')

  if (!serializedState)
    return null

  return JSON.parse(serializedState)
}

