import bitcoinjs = require('bitcoinjs-lib');
import { BTCNetwork } from 'btc-p2p';
import JsonRpc from './lib/JsonRpc';
import config from './config.json';
import { NETWORKS } from './lib/utils';
import Big = require('big.js');

const BTC_MAINNET = {
    magic: 0xD9B4BEF9,
    port: 8333,
    network: NETWORKS.btc
};
const BTC_TESTNET = {
    magic: 0x0709110B,
    port: 18333,
    network: NETWORKS.btctest

};
const LTC_MAINNET = {
    magic: 0xD9B4BEF9,
    port: 8333,
    network: NETWORKS.ltc
};
const LTC_TESTNET = {
    magic: 0xF1C8D2FD,
    port: 18333,
    network: NETWORKS.ltc
};

const netOptions = BTC_TESTNET;
const p2p = new BTCNetwork(netOptions);

// Given string in hex, change LE to BE and vice versa
function flipEndianess(str) {
    const result = [];
    let len = str.length - 2;
    while (len >= 0) {
        result.push(str.substr(len, 2));
        len -= 2;
    }
    return result.join('');
}

function isWatchedAddress(addr) {
    return config.watch.includes(addr);
}

process.once('SIGINT', () => {
    console.log('Got SIGINT; closing...');
    process.once('SIGINT', () => {
        // Double SIGINT; force-kill
        process.exit(0);
    });
    p2p.shutdown();
});

// Error messages of various severity, from the PeerManager
p2p.on('error', (d) => {
    console.log('(' + d.severity + '): ' + d.message);
});

p2p.on('transactionInv', (d) => {
    console.log('Peer ' + d.peer.getUUID() + ' knows of Transaction ' + flipEndianess(d.hash.toString('hex')));
    p2p.getData({ type: 1, hash: d.hash }, d.peer, async (err, rs) => {
        if (err !== false) {
            console.log('Data returned error: ' + err);
            return;
        }
        const txHash = flipEndianess(rs[0].data.hash.toString('hex'));
        console.log('Fetching details of Tx', txHash);
        const rawTx = await JsonRpc.doRequest('getrawtransaction', [txHash]);
        const decodedTx = await JsonRpc.doRequest('decoderawtransaction', [rawTx]);
        console.log(`>>> Decoded Tx ${txHash}`, decodedTx);
        decodedTx.vout.forEach((out) => {
            const addr = bitcoinjs.address.fromOutputScript(Buffer.from(out.scriptPubKey.hex, 'hex'), netOptions.network);
            if (isWatchedAddress(addr)) {
                const amount = Big(out.value);
                console.log(`>>> Deposit into ${addr} for ${amount.toString()} coins (${amount.times(1e8).toNumber()} sats)`);
            }
        });
    });
});

p2p.launch([{ host: config.daemon.host, port: config.daemon.port }]);

// const messages = new Messages({ network: Networks.testnet });
// pool = new Pool({ network: Networks.testnet });

// pool.on('peerinv', (peer, invMsg) => {
//     invMsg.inventory.forEach(_ => {
//         const txHash = _.hash;
//         if (_.type === 1) {
//             console.log('Getting details for TX', flipEndianess(txHash.toString('hex')));
//             const getTxMsg = messages.GetData.forTransaction(txHash);
//             // TODO: check if already in cache
//             peer.sendMessage(getTxMsg);
//         } else if (_.type === 0x40000001) {
//             // transaction with witness data
//             console.log(`>>> Getting details for TX WITH WITNESS DATA`, flipEndianess(txHash.toString('hex')));
//             process.exit(1);
//         } else if (_.type === 2) {
//             console.log(`>>> Block hash`, flipEndianess(txHash.toString('hex')));
//         } else {
//             console.log('INV of unknown type=', _.type);
//         }
//     });
// });

// pool.on('peertx', (peer, txMsg) => {
//     // console.log(`Details for TX`, JSON.stringify(txMsg.transaction, null, 2));
//     // txMsg.transaction.outputs.forEach((_, idx) => {
//     //     const output = JSON.parse(JSON.stringify(_));
//     //     output.scriptBuff = Buffer.from(output.script, 'hex');
//     //     console.log(`>>> OUTPUT:${idx}:`, output);
//     //     try {
//     //         console.log(`>>> ${output.satoshis} paid to address `, bitcoinjs.address.fromOutputScript(output.scriptBuff, bitcoinjs.networks.testnet));
//     //     } catch (err) {
//     //         console.log(`>>> ERROR`, err);
//     //     }
//     // });
//     const txHash = txMsg.transaction.hash;
//     console.log(`>>> txHash should be `, txHash);
//     txMsg.transaction.inputs.forEach((_, idx) => {
//         const input = JSON.parse(JSON.stringify(_));
//         console.log(`>>> INPUT:${idx}`, input);
//         if (input.script === '') {
//             // console.log(`Details for TX`, JSON.stringify(txMsg.transaction, null, 2));
//             console.log(`>>> WITNESS input detected; TX details:`, JSON.stringify(txMsg, null, 2));
//             process.exit(1);
//             // console.log(`>>> PEER `, peer);
//             // const getWitnessTxMsg = messages.GetData.forWitnessTransaction(txHash);
//             // peer.sendMessage(getWitnessTxMsg);
//         } else {
//             console.log(`>>> INPUT:${idx}: `, input);
//         }
//     });
// });

// pool.connect();

// // pool.disconnect();
