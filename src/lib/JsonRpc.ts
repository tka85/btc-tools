import debug = require('debug');
import JsonRpc2 = require('json-rpc2');
import JsonRpcError from './Errors/JsonRpcError';

class JsonRpc {
    public rpcClient;

    constructor(public host: string, public port: number, public user: string, public password: string) {
        this.rpcClient = Object.assign(JsonRpc2.Client.$create(port, host), { user, password });
    }

    async doRequest(cmd: string, params: any[] = []): Promise<any> {
        // console.log(`jsonRPC: ${cmd} ${JSON.stringify(params)}`);
        return new Promise((resolve, reject) => {
            this.rpcClient.call(cmd, params, function cb(err, result) {
                if (err) {
                    reject(new JsonRpcError(err.message, cmd, params));
                }
                resolve(result);
            });
        });
    }
}

export default JsonRpc;