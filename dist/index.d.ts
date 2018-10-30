import { BrowserHeaders } from 'browser-headers';
export declare type Metadata = BrowserHeaders | {
    [key: string]: string;
};
export declare type ServiceError = {
    message: string;
    code: number;
    metadata: Metadata;
};
export interface Client {
    serviceHost: string;
}
declare type FirstArgumentType<T> = T extends (arg: infer U) => any ? U : any;
declare type CallbackArgumentType<T> = T extends (_: any, callback: (_: any, response: infer U) => void) => any ? U : any;
export declare type PromiseClientProxy<T extends Client> = {
    [P in keyof T]: (req: FirstArgumentType<T[P]>, meta?: Metadata) => Promise<CallbackArgumentType<T[P]>>;
};
export declare function promisify<TClient extends Client>(client: TClient): PromiseClientProxy<TClient>;
export {};
//# sourceMappingURL=index.d.ts.map