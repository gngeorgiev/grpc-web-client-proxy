import { BrowserHeaders } from 'browser-headers';

export type Metadata = BrowserHeaders | { [key: string]: string };

export type ServiceError = {
    message: string;
    code: number;
    metadata: Metadata;
};

export interface Client {
    serviceHost: string;
}

type FirstArgumentType<T> = T extends (arg: infer U, ...args: any[]) => any
    ? U
    : any;

type CallbackArgumentType<T> = T extends (
    _: any,
    callback: (_: any, response: infer U) => void
) => any
    ? U
    : any;

export type PromiseClientProxy<T extends Client> = {
    [P in keyof T]: (
        req: FirstArgumentType<T[P]>,
        meta?: Metadata
    ) => Promise<CallbackArgumentType<T[P]>>
};

export function promisify<TClient extends Client>(
    client: TClient
): PromiseClientProxy<TClient> {
    //we don't really care about type safety here
    //type safety is guaranteed for the user by the proxy type
    const proxy = Object.keys(Object.getPrototypeOf(client))
        .filter(k => typeof (client as any)[k] === 'function')
        .reduce((acc: any, method: string) => {
            acc[method] = (req: any, meta: any) => {
                return new Promise((resolve, reject) => {
                    (client as any)[method].bind(client)(
                        req,
                        meta,
                        (err: ServiceError, resp: any) =>
                            err ? reject(err) : resolve(resp)
                    );
                });
            };

            return acc;
        }, {});

    return proxy as PromiseClientProxy<TClient>;
}
