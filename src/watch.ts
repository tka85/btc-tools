import bitcoinjs = require('bitcoinjs-lib');
import bitcore = require('bitcore-lib');
import p2p = require('bitcore-p2p');

const Pool = p2p.Pool;
const Messages = p2p.Messages;
const Networks = bitcore.Networks;

const messages = new Messages({ network: Networks.testnet });
pool = new Pool({ network: Networks.testnet });

function changeEndianess(str) {
    const result = [];
    let len = str.length - 2;
    while (len >= 0) {
        result.push(str.substr(len, 2));
        len -= 2;
    }
    return result.join('');
}

pool.on('peerinv', (peer, invMsg) => {
    invMsg.inventory.forEach(_ => {
        if (_.type === 1) {
            const txHash = _.hash;
            console.log('Getting details for TX', changeEndianess(txHash.toString('hex')));
            const getTxMsg = messages.GetData.forTransaction(txHash);
            // TODO: check if already in cache
            peer.sendMessage(getTxMsg);
        } else if (_.type === 0x40000001) {
            // transaction with witness data
            console.log(`>>> Getting details for TX WITH WITNESS DATA`, changeEndianess(_.hash.toString('hex')));
            process.exit(1);
        } else if (_.type === 2) {
            console.log(`>>> Block hash`, changeEndianess(_.hash.toString('hex')));
        } else {
            console.log('INV of unknown type=', _.type);
        }
    });
});

pool.on('peertx', (peer, txMsg) => {
    // console.log(`Details for TX`, JSON.stringify(txMsg.transaction, null, 2));
    // txMsg.transaction.outputs.forEach((_, idx) => {
    //     const output = JSON.parse(JSON.stringify(_));
    //     output.scriptBuff = Buffer.from(output.script, 'hex');
    //     console.log(`>>> OUTPUT:${idx}:`, output);
    //     try {
    //         console.log(`>>> ${output.satoshis} paid to address `, bitcoinjs.address.fromOutputScript(output.scriptBuff, bitcoinjs.networks.testnet));
    //     } catch (err) {
    //         console.log(`>>> ERROR`, err);
    //     }
    // });
    const txHash = txMsg.transaction.hash;
    console.log(`>>> txHash should be `, txHash);
    txMsg.transaction.inputs.forEach((_, idx) => {
        const input = JSON.parse(JSON.stringify(_));
        console.log(`>>> INPUT:${idx}`, input);
        if (input.script === '') {
            console.log(`>>>_______________________________________________________________________________________________ WITNESS input detected; requesting WitnessTransaction`);
            console.log(`>>> PEER `, peer);
            const getWitnessTxMsg = messages.GetData.forWitnessTransaction(txHash);
            peer.sendMessage(getWitnessTxMsg);
        } else {
            console.log(`>>> INPUT:${idx}: `, input);
        }
    });
});

pool.connect();

// pool.disconnect();
