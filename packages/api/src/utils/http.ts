import { getUserToken } from '@utils/helpers'
import { ServiceReturn } from '@typings/Rest'

// -> Constants
// ------------

const { VITE_DELTA_API: baseApi } = import.meta.env
const SUCCESS_CODES = [ 200, 201, 202, 204 ]

// -> Types
// --------

interface RequestOptions {
  data?: any
  config?: RequestInit,
  headers?: HeadersInit
}

type SlimRequestFn = (endpoint: string, data?: any) =>
  Promise<ServiceReturn>

type HTTPRequestFunction = (
  endpoint: string,
  options?: RequestOptions
) => Promise<ServiceReturn>


// -> Functions
// ------------

/**
 * Simply receives a Fetch HTTP Response object and transforms
 * it into a JSON object.
 */
export const reqToJson = (
  res: Response
): Promise<ServiceReturn> | ServiceReturn => {
  if (!res) return [ true, undefined ]

  if (!SUCCESS_CODES.includes(res.status))
    return [ res, undefined ]

  return res.json()
    .catch((err: Error): ServiceReturn => [ err, null ])
    .then((data: any): ServiceReturn =>
      [ null, data?.data || data ])
}

/**
 *
 */
export const mkRequest =
  (method: string): HTTPRequestFunction => async (
    endpoint: string,
    {
      data,
      headers: headerExtends = {},
      config: configExtends = {},
    }: RequestOptions = {}
  ): Promise<ServiceReturn> => {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-session-token': getUserToken(),
      Authorization: getUserToken(),
      ...headerExtends
    }

    const noBodyMethods = [ 'GET', 'HEAD' ]
    const excludeData = noBodyMethods.includes(method)

    const config = {
      ...configExtends,
      ...(data && !excludeData
        ? { body: JSON.stringify(data) } : {}),
      headers,
      method
    }

    return fetch(`${baseApi}/${endpoint}`, config)
      .catch(err => [ err, undefined ])
      .then(response => reqToJson(response as Response))
  }

export const mkSlimRequest = (
  method: string
): SlimRequestFn => {
  const requestFn = mkRequest(method)
  const slimRequestFn = (endpoint: string, data?: any) =>
    requestFn(endpoint, { data })

  return slimRequestFn
}

// -> Export
// ---------

interface HttpFn {
  post: SlimRequestFn
  put: SlimRequestFn
  get: SlimRequestFn
  delete: SlimRequestFn
  patch: SlimRequestFn
  baseApi: () => string
}

export default {
  get: mkSlimRequest('GET'),
  post: mkSlimRequest('POST'),
  put: mkSlimRequest('PUT'),
  delete: mkSlimRequest('DELETE'),
  patch: mkSlimRequest('PATCH'),
  baseApi: () => baseApi
} as HttpFn
