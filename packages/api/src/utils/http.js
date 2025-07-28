import { getUserToken } from '@utils/helpers';
// -> Constants
// ------------
const { VITE_DELTA_API: baseApi } = import.meta.env;
const SUCCESS_CODES = [200, 201, 202, 204];
// -> Functions
// ------------
/**
 * Simply receives a Fetch HTTP Response object and transforms
 * it into a JSON object.
 */
export const reqToJson = (res) => {
    if (!res)
        return [true, undefined];
    if (!SUCCESS_CODES.includes(res.status))
        return [res, undefined];
    return res.json()
        .catch((err) => [err, null])
        .then((data) => [null, data?.data || data]);
};
/**
 *
 */
export const mkRequest = (method) => async (endpoint, { data, headers: headerExtends = {}, config: configExtends = {}, } = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-session-token': getUserToken(),
        Authorization: getUserToken(),
        ...headerExtends
    };
    const noBodyMethods = ['GET', 'HEAD'];
    const excludeData = noBodyMethods.includes(method);
    const config = {
        ...configExtends,
        ...(data && !excludeData
            ? { body: JSON.stringify(data) } : {}),
        headers,
        method
    };
    return fetch(`${baseApi}/${endpoint}`, config)
        .catch(err => [err, undefined])
        .then(response => reqToJson(response));
};
export const mkSlimRequest = (method) => {
    const requestFn = mkRequest(method);
    const slimRequestFn = (endpoint, data) => requestFn(endpoint, { data });
    return slimRequestFn;
};
export default {
    get: mkSlimRequest('GET'),
    post: mkSlimRequest('POST'),
    put: mkSlimRequest('PUT'),
    delete: mkSlimRequest('DELETE'),
    patch: mkSlimRequest('PATCH'),
    baseApi: () => baseApi
};
