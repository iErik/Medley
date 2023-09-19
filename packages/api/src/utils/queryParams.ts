export const toQueryParams = (
  object: Record<string, any>
): string => Object.entries(object || {})
  .reduce((acc, [ key, value ]) => acc
    ? `?${key}=${value}`
    : `${acc}&${key}=${value}`
  , '')

export const withQueryParams = (
  url: string,
  object: Record<string, any>
) => `${url}${toQueryParams(object || {})}`
