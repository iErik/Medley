import { ServiceReturn } from '@/types/Rest';
interface RequestOptions {
    data?: any;
    config?: RequestInit;
    headers?: HeadersInit;
}
type SlimRequestFn = (endpoint: string, data?: any) => Promise<ServiceReturn>;
type HTTPRequestFunction = (endpoint: string, options?: RequestOptions) => Promise<ServiceReturn>;
/**
 * Simply receives a Fetch HTTP Response object and transforms
 * it into a JSON object.
 */
export declare const reqToJson: (res: Response) => Promise<ServiceReturn> | ServiceReturn;
/**
 *
 */
export declare const mkRequest: (method: string) => HTTPRequestFunction;
export declare const mkSlimRequest: (method: string) => SlimRequestFn;
interface HttpFn {
    post: SlimRequestFn;
    put: SlimRequestFn;
    get: SlimRequestFn;
    delete: SlimRequestFn;
    patch: SlimRequestFn;
    baseApi: () => string;
}
declare const _default: HttpFn;
export default _default;
//# sourceMappingURL=http.d.ts.map