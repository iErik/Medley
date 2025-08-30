/**
 *
 * @param value
 * @param constructor
 * @returns
 */
export const isType = (
  value: any,
  constructor: string
): boolean =>
  Object.prototype.toString
    .call(value) === `[object ${constructor}]`

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

/*
 *
 */
export const executeMap = (
  map: { [fnName: string]: (...args: any) => any } = {},
  key: string = '',
  args: Array<any> = []
): any => Object.keys(map).includes(key)
  ? map[key](...args)
  : null


