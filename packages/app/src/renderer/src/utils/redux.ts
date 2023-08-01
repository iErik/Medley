import produce from 'immer'
import { camelToSnake } from '@utils/helpers'

// -> Types
// --------

export type ActionSignature = {
  type: string,
  args: HandlerArgs
}

type ActionCreators = {
  [actionName: string]:
    (...args: Array<any>) => ActionSignature
}

type HandlerArgs = Record<string, any>

type ReducerArgs = Array<string> | object | null

interface ReducerHandler<StateType, ArgsType> {
  (state: StateType, args: ArgsType): StateType | void
}

interface ReducerSignature<StateType, ArgsType> {
  args: ReducerArgs,
  handler?: ReducerHandler<StateType, ArgsType>
}

interface ReducersPrototype<StateType> {
  [handlerName: string]: ReducerSignature<StateType, any>
}

interface Reducers<StateType> {
  [reducerName: string]: ReducerHandler<StateType, any>
}

interface RootReducer<StateType> {
  (state: StateType, action: ReduxAction): StateType
}

interface StoreTemplate<StateType>  {
  types: { [actionName: string]: string }
  actions: ActionCreators
  reducers: Reducers<StateType>
  rootReducer: RootReducer<StateType>
}

// -> Helper Functions
// -------------------

/**
 *
 * @param prototype
 * @param prefix
 * @returns {StoreTemplate}
 */
export const createReducer = <StateType>(
  initialState: StateType,
  prototype: ReducersPrototype<StateType>,
  prefix?: string
): StoreTemplate<StateType> => {
  const getType = (reducerName: string) => prefix
    ? `${prefix}/${camelToSnake(reducerName).toUpperCase()}`
    : camelToSnake(reducerName).toUpperCase()

  const extractArrayArgs = (
    declaredArgs: Array<string>,
    receivedArgs: Array<any>
  ) => declaredArgs?.reduce(
    (acc: object, argName: string, idx: number) =>
        ({ ...acc, [argName]: receivedArgs[idx] }), {})

  const extractObjectArgs = (
    declaredArgs: object,
    receivedArgs: Array<any>
  ) => Object.entries(declaredArgs || {})?.reduce(
    (acc: object, [ argName, defaultVal ]) =>
      ({ ...acc
      , [argName]: Object.keys(receivedArgs[0])
        .includes(argName)
          ? receivedArgs[0][argName]
          : defaultVal
      }), {})

  const getArgs = (
    declaredArgs: ReducerArgs,
    receivedArgs: Array<any>
  ) => declaredArgs
    ? Array.isArray(declaredArgs)
      ? extractArrayArgs(declaredArgs, receivedArgs)
      : extractObjectArgs(declaredArgs, receivedArgs)
    : []

  const { actions, reducers } = Object
    .entries(prototype)
    .reduce((
      acc: { actions: object, reducers: object },
      [ reducerName, reducerObj ]
    ) => ({
      actions: {
        ...acc.actions,
        [reducerName]: (...args: Array<any>) => ({
          type: getType(reducerName),
          args: getArgs(reducerObj?.args, args)
        })
      },
      reducers: {
        ...acc.reducers,
        ...(reducerObj?.handler
          ? { [getType(reducerName)]:
              produce(reducerObj?.handler) }
          : {})
      }
    }), { actions: {}, reducers: {} })

  const types = Object.keys(prototype).reduce(
    (acc, key) => ({ ...acc, [key]: getType(key) }), {})

  const rootReducer = (
    state: StateType = initialState,
    action: ReduxAction
  ): StateType => Object.keys(reducers).includes(action.type)
    ? (reducers as Reducers<StateType>)[action.type](
      state,
      action.args) as StateType
    : state

  return {
    types,
    actions,
    rootReducer,
    reducers,
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
export const loadSerializedStore = () =>
  JSON.parse(localStorage.getItem('storeState'))
