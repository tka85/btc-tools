import debug = require('debug');
import JsonRpc2 = require('json-rpc2');
import JsonRpcError from './Errors/JsonRpcError';
import config from '../config.json';

// const log = config.debug ? debug('btc-tools:jsonRpc') : Function.prototype;
const { host, port, user, password } = config.peers[0];

const rpcClient = Object.assign(JsonRpc2.Client.$create(port, host), { user, password });

class JsonRpc {
    static async doRequest(cmd: string, params: any[] = []): Promise<any> {
        console.log(`jsonRPC: ${cmd} ${JSON.stringify(params)}`);
        return new Promise((resolve, reject) => {
            rpcClient.call(cmd, params, function cb(err, result) {
                if (err) {
                    reject(new JsonRpcError(err.message, cmd, params));
                }
                resolve(result);
            });
        });
    }
}

export default JsonRpc;