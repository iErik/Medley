export const toQueryParams = (
  object: Record<string, any>
): string => Object.entries(object || {})
  .reduce((acc, [ key, value ]) => acc
    ? `?${key}=${value}`
    : `${acc}&${key}=${value}`
  , '')
