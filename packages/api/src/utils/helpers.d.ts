/**
 * @param value
 * @returns - Name of the type of the value
 */
export declare const getType: (value: any) => string;
/**
 * Checks if value is of type constructor
 *
 * @param value
 * @param constructor
 * @returns - True if value is of type constructor
 */
export declare const isType: (value: any, constructor: string | string[]) => boolean;
/**
 *
 */
export declare const getUserToken: () => any;
export declare const snakeToCamel: (str: string) => string;
export declare const camelToSnake: (str: string) => string;
export declare const normalizeObjKeys: (obj: Record<string, any>) => Record<string, any>;
/**
 *
 */
export declare const pluckObj: (obj: Record<string, any>, excludeKeys: string[]) => Record<string, any>;
/**
 *
 */
export declare const executeMap: (map?: {
    [fnName: string]: (...args: any) => any;
}, key?: string, args?: Array<any>) => any;
type RestHandlerDef = {
    name: string;
    endpoint: string;
    method: 'get' | 'post' | 'delete';
    in?: (...args: any) => any;
    out?: (...args: any) => any;
};
/**
 *
 */
export declare const mkRestHandler: (handlerDefinition: RestHandlerDef) => (handlerArgs: Record<string, any> | null) => Promise<any[]>;
export declare const mkRestModule: (handlers: RestHandlerDef[]) => Record<string, Function>;
export {};
//# sourceMappingURL=helpers.d.ts.map