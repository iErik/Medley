import http from '@utils/http'

/**
 * @param value
 * @returns - Name of the type of the value
 */
export const getType = (value: any) =>
  Object.prototype.toString.call(value)
    .replace(/(\[|\]|object )/g, '')

/**
 * Checks if value is of type constructor
 *
 * @param value
 * @param constructor
 * @returns - True if value is of type constructor
 */
export const isType = (
  value: any,
  constructor: string | string[]
): boolean => Array.isArray(constructor)
  ? constructor.includes(getType(value))
  : [ constructor ].includes(getType(value))

/**
 *
 */
export const getUserToken = () => {
  const userToken = localStorage.getItem('token')
  return userToken && JSON.parse(userToken)
}

/*
 *
 */
export const snakeToCamel = (str: string) =>
  str.toLowerCase().replace(/([-_][a-z])/g, group => group
    .toUpperCase()
    .replace('-', '')
    .replace('_', ''))

export const camelToSnake = (str: string) =>
  str.split(/(?=[A-Z])/).join('_').toLowerCase()

/*
 *
 */
export const normalizeObjKeys = (
  obj: Record<string, any>
): Record<string, any> => Object.entries(obj).reduce(
  (acc: Record<any, string>, [ key, value ]) => ({
    ...acc,
    [snakeToCamel(key)]: isType(value, 'Object')
      ? normalizeObjKeys(value as Record<string, any>)
      : isType(value, 'Array')
      ? value.map((item: any) =>
        isType(item, 'Object') || isType(item, 'Array')
          ? normalizeObjKeys(item)
          : item)
      : value
  }), {})

/**
 *
 */
export const pluckObj = (
  obj: Record<string, any>,
  excludeKeys: string[]
): Record<string, any> => Object.fromEntries(
  Object.entries(obj || {})
    .filter(([ key ]) => !excludeKeys.includes(key)))

/**
 *
 */
export const executeMap = (
  map: { [fnName: string]: (...args: any) => any } = {},
  key: string = '',
  args: Array<any> = []
): any => Object.keys(map).includes(key)
  ? map[key](...args)
  : null

type RestHandlerDef = {
  name: string
  endpoint: string
  method: 'get' | 'post' | 'delete'
  in?: (...args: any) => any
  out?: (...args: any) => any
}

/**
 *
 */
export const mkRestHandler = (
  handlerDefinition: RestHandlerDef
) => {
  const argsMapper = handlerDefinition.in
  const endpointTokens = handlerDefinition.endpoint
    .split('/')
    .filter(bit => bit.indexOf(':') > -1)
    .map(token => token.split(':')[1])

  return async (
    handlerArgs: Record<string, any> | null
  ) => {
    const method = handlerDefinition?.method
    const endpoint = handlerDefinition.endpoint
      .replace(/\:(\w+)/g, (_, argName: string) =>
        (handlerArgs || {})[argName] || '')

    const orphanArgs = pluckObj(
      handlerArgs || {},
      endpointTokens)
    const hasOrphanArgs = Object.keys(orphanArgs).length

    const [ err, data ] = await http[method]
      .call(null, endpoint, {
        ...(!hasOrphanArgs
          ? {}
          : argsMapper
            ? argsMapper(orphanArgs)
            : orphanArgs)
      })

    return [
      err,
      handlerDefinition.out && !err
        ? handlerDefinition.out(data)
        : data
    ]
  }
}

export const mkRestModule = (
  handlers: RestHandlerDef[]
): Record<string, Function> => handlers
  .reduce((
    acc: Record<string, Function>,
    def: RestHandlerDef
  ) => ({
    ...acc,
    [def.name]: mkRestHandler(def)
  }), {})
