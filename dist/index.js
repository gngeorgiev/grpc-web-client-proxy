"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function promisify(client) {
    //we don't really care about type safety here
    //type safety is guaranteed for the user by the proxy type
    const proxy = Object.keys(Object.getPrototypeOf(client))
        .filter(k => typeof client[k] === 'function')
        .reduce((acc, method) => {
        acc[method] = (req, meta) => {
            return new Promise((resolve, reject) => {
                client[method].bind(client)(req, meta, (err, resp) => err ? reject(err) : resolve(resp));
            });
        };
        return acc;
    }, {});
    return proxy;
}
exports.promisify = promisify;
//# sourceMappingURL=index.js.map