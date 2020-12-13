import assert = require('assert');
import { BTCNetwork } from 'btc-p2p';
import JsonRpc from './lib/JsonRpc';
import { flipEndianess, NETWORKS } from './lib/utils';
import { Big } from 'big.js';
import { inspect } from 'util';

const cache = {};
const pending = [];

const DNS_SEEDS = {
    btc: ['bitseed.xf2.org', 'dnsseed.bluematt.me', 'seed.bitcoin.sipa.be', 'dnsseed.bitcoin.dashjr.org'],
    btctest: ['seed.tbtc.petertodd.org', 'testnet-seed.bitcoin.jonasschnelli.ch', 'seed.testnet.bitcoin.sprovoost.nl'],
    ltc: ['dnsseed.litecointools.com', 'seed-a.litecoin.loshan.co.uk', 'dnsseed.thrasher.io', 'dnsseed.litecoinpool.org'],
    ltctest: ['testnet-seed.litecointools.com', 'seed-b.litecoin.loshan.co.uk', 'dnsseed-testnet.thrasher.io']
}

const MAGIC = {
    btc: 0xD9B4BEF9,
    btctest: 0x0709110B,
    ltc: 0xD9B4BEF9,
    ltctest: 0xF1C8D2FD,
};

const P2P_PORT = {
    btc: 8333,
    btctest: 18333,
    ltc: 9333,
    ltctest: 19333
};

type watchParams = {
    network: 'btc' | 'btctest' | 'ltc' | 'ltctest',
    jsonRpcHost: string,
    jsonRpcPort: number,
    jsonRpcUser: string,
    jsonRpcPassword: string,
    watchList?: string,
    watchFile: string
};

function isWatchedAddress(addr) {
    // return config.watch.includes(addr);
}

function printVout(txHash: string, vout: number, addr: string, amount: Big, watchList: string[]): void {
    if (!watchList.includes(addr)) {
        console.log(`> ${addr.padEnd(43, ' ')} received ${amount.toString().padEnd(16, ' ')} [${txHash}:${vout}]`);
    } else {
        console.log(`************************************************************************n\t> [RECEIVING] ${addr.padEnd(43, ' ')} received ${amount.toString().padEnd(16, ' ')} [${txHash}:${vout}]\n************************************************************************`);
    }
}

function printVin(txHash: string, vin: number, vinOriginTxHash: string, spentVout: number, addr: string, spentAmount: Big, watchList: string[]): void {
    if (!watchList.includes(addr)) {
        console.log(`< ${addr.padEnd(43, ' ')} spent ${spentAmount.toString().padEnd(16, ' ')} [${txHash}:${vin} spending UTXO ${vinOriginTxHash}:${spentVout}]`);
    } else {
        console.log(`************************************************************************n\t> [SPENDING] ${addr.padEnd(43, ' ')} sent ${spentAmount.toString().padEnd(16, ' ')} [${txHash}:${vin} spending UTXO ${vinOriginTxHash}:${spentVout}]\n************************************************************************`);
    }
}

// TODO: implement function validateParams() {}

export function watch({ network, jsonRpcHost, jsonRpcPort, jsonRpcUser, jsonRpcPassword, watchList, watchFile }: watchParams): void {
    // TODO: call validateParams({ network, jsonRpcHost, jsonRpcPort, jsonRpcUser, jsonRpcPassword, watchList, watchFile });

    const addrWatchList = watchList.split(',').map(_ => _.trim());
    console.log(`Watching addresses:`, addrWatchList);

    const jsonRpc = new JsonRpc(jsonRpcHost, jsonRpcPort, jsonRpcUser, jsonRpcPassword);
    const p2pOptions = {
        useCache: true,
        listen: true,
        port: P2P_PORT[network],
        magic: MAGIC[network],
        minPeers: 2,
        maxPeers: 20,
        idleTimeout: 30 * 60 * 1000, // time out peers we haven't heard anything from in 30 minutes
        version: 70000,
        services: Buffer.from([1, 0, 0, 0, 0, 0, 0, 0]),
        clientName: 'Node.js lite peer',
        knownHeight: 0,
        externalIP: false
    };

    const p2p = new BTCNetwork(p2pOptions);

    // Error messages of various severity, from the PeerManager
    p2p.on('error', (d) => {
        console.log('(' + d.severity + '): ' + d.message);
    });

    // p2p.on('message', function peerMessage(d) {
    //     console.log(d.peer.getUUID() + ': message', d.command, d.data);
    // });

    p2p.on('transactionInv', (d) => {
        const txHash = flipEndianess(d.hash.toString('hex'));
        if (cache[txHash]) {
            console.log(`Skipping cached tx ${txHash}`);
            return;
        }
        cache[txHash] = Date.now();
        console.log(`Peer ${d.peer.getUUID()} knows of tx ${txHash}`);
        p2p.getData({ type: 1, hash: d.hash }, d.peer, async (err, rs) => {
            if (err !== false) {
                console.log(`Error getting data for tx ${txHash}`, err);
                return;
            }
            let rawTx;
            let decodedTx;
            console.log('Fetching details of tx', txHash);
            try {
                rawTx = await jsonRpc.doRequest('getrawtransaction', [txHash]);
                decodedTx = await jsonRpc.doRequest('decoderawtransaction', [rawTx]);
            } catch (err) {
                console.log(`>>> transaction ${txHash} not found in local node; postponing`, err.message.match(/No such mempool or blockchain transaction/));
                return;
            }
            // console.log(`Decoded Tx ${txHash}`, inspect(decodedTx, { depth: null }));
            let vin = -1;
            for (const input of decodedTx.vin) {
                vin++;
                try {
                    // Lookup tx that generated the UTXO being spent
                    const vinOriginTxHash = input.txid;
                    const rawVinOriginTx = await jsonRpc.doRequest('getrawtransaction', [vinOriginTxHash]);
                    const decodedVinOriginTx = await jsonRpc.doRequest('decoderawtransaction', [rawVinOriginTx]);
                    const spentOutput = decodedVinOriginTx.vout[input.vout];
                    const spentAmount = new Big(spentOutput.value);
                    const spentVout = spentOutput.n;
                    assert.strictEqual(spentVout, input.vout);
                    // console.log(`>>> SPENT tx input ${txHash}:${vin} originating from ${vinOriginTxHash}:${spentVout} address`, inspect(spentOutput.scriptPubKey.addresses, { depth: null }));
                    if (spentOutput.scriptPubKey.type === 'pubkey') {
                        console.log(`>>> Skipping P2PK output ${vinOriginTxHash}:${spentVout}`);
                        continue;
                    }
                    if (spentOutput.scriptPubKey.addresses) {
                        for (const addr of spentOutput.scriptPubKey.addresses) {
                            printVin(txHash, vin, vinOriginTxHash, spentVout, addr, spentAmount, addrWatchList);
                        }
                    }
                } catch (err) {
                    throw err;
                }
            }
            for (const output of decodedTx.vout) {
                const amount = new Big(output.value);
                const vout = output.n;
                // console.log(`>>> OUTPUT tx output ${txHash}:${vout} address`, inspect(output.scriptPubKey.addresses, { depth: null }));
                if (output.scriptPubKey.type === 'pubkey') {
                    console.log(`>>> Skipping P2PK output ${txHash}:${vout}`);
                    continue;
                }
                if (output.scriptPubKey.addresses) {
                    for (const addr of output.scriptPubKey.addresses) {
                        printVout(txHash, vout, addr, amount, addrWatchList);
                    }
                }

            }
        });
    });

    // Default launch using DNS seeds
    p2p.launch();

    process.once('SIGINT', () => {
        console.log('Got SIGINT; closing...');
        process.once('SIGINT', () => {
            // Double SIGINT; force-kill
            process.exit(0);
        });
        p2p.shutdown();
    });
}
