import { getUserToken } from "@utils/helpers"

// -> Constants
// ------------
const { DISCORD_API: baseApi } = __APP_ENV__
const SUCCESS_CODES = [ 200, 201, 202, 204 ]

// -> Types
// --------

interface RequestOptions {
  data?: any
  config?: RequestInit,
  headers?: HeadersInit
}

// -> Functions
// ------------

/**
 *
 */
export const reqToJson = (res: Response) => {
  if (!res) return [ true, undefined ]

  if (!SUCCESS_CODES.includes(res.status))
    return [ res, undefined ]

  return res.json()
    .catch(err => [ err, undefined ])
    .then(data => [ undefined, data?.data || data ])
}

/**
 *
 */
export const mkRequest = (method: string) => async (
  endpoint: string,
  {
    data,
    headers: headerExtends = {},
    config: configExtends = {},
  }: RequestOptions = {}
) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: getUserToken(),
    ...headerExtends
  }

  const config = {
    ...configExtends,
    ...(data ? { body: JSON.stringify(data) } : {}),
    headers,
    method
  }

  return fetch(`${baseApi}/${endpoint}`, config)
    .catch(err => [ err, undefined ])
    .then(response => reqToJson(response as Response))
}

export const mkSlimRequest = (method: string) => {
  const requestFn = mkRequest(method)
  const slimRequestFn = (endpoint: string, data?: any) =>
    requestFn(endpoint, { data })

  return slimRequestFn
}

// -> Export
// ---------

export default {
  get: mkSlimRequest('GET'),
  post: mkSlimRequest('POST'),
  delete: mkSlimRequest('DELETE'),
}
