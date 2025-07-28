import http from '@utils/http';
/**
 * @param value
 * @returns - Name of the type of the value
 */
export const getType = (value) => Object.prototype.toString.call(value)
    .replace(/(\[|\]|object )/g, '');
/**
 * Checks if value is of type constructor
 *
 * @param value
 * @param constructor
 * @returns - True if value is of type constructor
 */
export const isType = (value, constructor) => Array.isArray(constructor)
    ? constructor.includes(getType(value))
    : [constructor].includes(getType(value));
/**
 *
 */
export const getUserToken = () => {
    const userToken = localStorage.getItem('token');
    return userToken && JSON.parse(userToken);
};
/*
 *
 */
export const snakeToCamel = (str) => str.toLowerCase().replace(/([-_][a-z])/g, group => group
    .toUpperCase()
    .replace('-', '')
    .replace('_', ''));
export const camelToSnake = (str) => str.split(/(?=[A-Z])/).join('_').toLowerCase();
/*
 *
 */
export const normalizeObjKeys = (obj) => Object.entries(obj).reduce((acc, [key, value]) => ({
    ...acc,
    [snakeToCamel(key)]: isType(value, 'Object')
        ? normalizeObjKeys(value)
        : isType(value, 'Array')
            ? value.map((item) => isType(item, 'Object') || isType(item, 'Array')
                ? normalizeObjKeys(item)
                : item)
            : value
}), {});
/**
 *
 */
export const pluckObj = (obj, excludeKeys) => Object.fromEntries(Object.entries(obj || {})
    .filter(([key]) => !excludeKeys.includes(key)));
/**
 *
 */
export const executeMap = (map = {}, key = '', args = []) => Object.keys(map).includes(key)
    ? map[key](...args)
    : null;
/**
 *
 */
export const mkRestHandler = (handlerDefinition) => {
    const argsMapper = handlerDefinition.in;
    const endpointTokens = handlerDefinition.endpoint
        .split('/')
        .filter(bit => bit.indexOf(':') > -1)
        .map(token => token.split(':')[1]);
    return async (handlerArgs) => {
        const method = handlerDefinition?.method;
        const endpoint = handlerDefinition.endpoint
            .replace(/\:(\w+)/g, (_, argName) => (handlerArgs || {})[argName] || '');
        const orphanArgs = pluckObj(handlerArgs || {}, endpointTokens);
        const hasOrphanArgs = Object.keys(orphanArgs).length;
        const [err, data] = await http[method]
            .call(null, endpoint, {
            ...(!hasOrphanArgs
                ? {}
                : argsMapper
                    ? argsMapper(orphanArgs)
                    : orphanArgs)
        });
        return [
            err,
            handlerDefinition.out && !err
                ? handlerDefinition.out(data)
                : data
        ];
    };
};
export const mkRestModule = (handlers) => handlers
    .reduce((acc, def) => ({
    ...acc,
    [def.name]: mkRestHandler(def)
}), {});
