export const toQueryParams = (object) => Object.entries(object || {})
    .reduce((acc, [key, value]) => acc
    ? `?${key}=${value}`
    : `${acc}&${key}=${value}`, '');
export const withQueryParams = (url, object) => `${url}${toQueryParams(object || {})}`;
