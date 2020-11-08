import assert = require('assert');
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import { isValidExtKey, isValidPublicKey, NETWORKS, normalizeExtKey } from './lib/utils';
import { DerivationPath } from './lib/DerivationPath';

const MULTISIG_FUNCS = {
    p2sh: P2SH_P2MS_MultisigAddress, // classical msig
    p2shp2wsh: P2SH_P2WSH_P2MS_MultisigAddress, // wrapped segwit msig
    p2wsh: P2WSH_P2MS_MultisigAddress // native segwit
};

type MultisigRecord = {
    address: string,
    type: string,
    publicKeys: string[],
    scriptPubKey?: string,
    redeem: string,
    redeemASM: string,
    path?: string
};

type MultisigParams = {
    multisigType: string,
    threshold: number,
    extKeys?: string, // comma separated list of xpub keys
    path?: string,
    count?: number,
    pubKeys?: string, // comma separated list of pub keys
    output?: 'table' | 'json',
    network?: 'btc' | 'btctest' | 'ltc' | 'ltctest'
};

type MultisigFunc = (threshold: number, publicKey: Buffer[], network: bitcoinjs.Network) => MultisigRecord;

// Normal multisig
function P2SH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[], network: bitcoinjs.Network): MultisigRecord {
    const res = bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys, network })
    });
    // path (if any) will be added by caller
    const redeemBuff = res.redeem.output;
    return { address: res.address, type: `p2sh-${threshold}-of-${publicKeys.length}`, publicKeys: publicKeys.map(_ => _.toString('hex')), scriptPubKey: res.output.toString('hex'), redeem: redeemBuff.toString('hex'), redeemASM: bitcoinjs.script.toASM(redeemBuff) };
}

// Wrapped segwit multisig
function P2SH_P2WSH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[], network: bitcoinjs.Network): MultisigRecord {
    const res = bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2wsh({
            redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys, network })
        })
    });
    // path (if any) will be added by caller
    const redeemBuff = res.redeem.redeem.output;
    return { address: res.address, type: `p2shp2wsh-${threshold}-of-${publicKeys.length}`, publicKeys: publicKeys.map(_ => _.toString('hex')), scriptPubKey: res.output.toString('hex'), redeem: redeemBuff.toString('hex'), redeemASM: bitcoinjs.script.toASM(redeemBuff) };
}

// Native segwit multisig
function P2WSH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[], network: bitcoinjs.Network): MultisigRecord {
    const res = bitcoinjs.payments.p2wsh({
        redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys, network })
    });
    // path (if any) will be added by caller
    const redeemBuff = res.redeem.output;
    return { address: res.address, type: `p2wsh-${threshold}-of-${publicKeys.length}`, publicKeys: publicKeys.map(_ => _.toString('hex')), redeem: redeemBuff.toString('hex'), redeemASM: bitcoinjs.script.toASM(redeemBuff) };
}

export function multisig({ multisigType, threshold, extKeys, path, count, pubKeys, output = null, network = 'btc' }: MultisigParams): MultisigRecord[] {
    const result: MultisigRecord[] = [];

    threshold = +threshold;
    count = +count;
    validateParams({ multisigType, threshold, extKeys, path, count, pubKeys, output, network });

    const multisigFunc: MultisigFunc = MULTISIG_FUNCS[multisigType];

    if (extKeys) {
        const xpubNodes: bip32.BIP32Interface[] = extKeys.split(',').map(_ => normalizeExtKey(_)).map(_ => bip32.fromBase58(_, NETWORKS[network]));
        const dPath = new DerivationPath(path);
        // Generate $count M-of-N multisig addresses from N xpub keys + $count path increments
        let nextMultisig: MultisigRecord;
        for (let i = 0; i < count; i++) {
            const pubKeyBuffers = [];
            xpubNodes.forEach(_ => {
                pubKeyBuffers.push(_.derivePath(dPath.normalizedPathToString()).publicKey);
            });
            nextMultisig = multisigFunc(threshold, pubKeyBuffers, NETWORKS[network]);
            nextMultisig.path = dPath.toString();
            result.push(nextMultisig);
            dPath.incrementPath();
        }
    } else if (pubKeys) {
        const pubKeyBuffers: Buffer[] = pubKeys.split(',').map(_ => Buffer.from(_, 'hex'));
        // Generate single M-of-N multisig address from single set of N public keys
        result.push(multisigFunc(threshold, pubKeyBuffers, NETWORKS[network]));
    }

    switch (output) {
        case 'table':
            console.table(result);
            return;
        case 'json':
            console.log(JSON.stringify(result, null, 2));
            return;
        default:
            return result;
    }
}

function validateParams(params: MultisigParams) {
    if (params.pubKeys && params.extKeys) {
        throw new Error('Either --pub-keys or --ext-keys can be defined. Not both.');
    } else if (!params.pubKeys && !params.extKeys) {
        throw new Error('At least one of either --pub-keys or --ext-keys must be defined.');
    }
    if (params.network && !NETWORKS[params.network]) {
        throw new Error(`Invalid network name ${params.network}. Valid values are 'btc', 'btctest', 'ltc' or 'ltctest'.`);
    }
    if (!Number.isInteger(+params.threshold)) {
        throw new Error(`--threshold "M" in "M-of-N" value "${params.count}" is not an integer`);
    }
    if (params.extKeys) {
        assert(params.path || params.path === '' || parseInt(params.path, 10) === 0, 'Missing --path derivation path (required with --ext-keys');
        assert(Number.isInteger(+params.count), `--count of derived addresses value "${params.count}" is not an integer`);
        const extKeysArray = params.extKeys.split(',');
        extKeysArray.forEach(_ => {
            assert(isValidExtKey(_, NETWORKS[params.network]), `${_} is not a valid ext key for network ${params.network}`);
        });
        assert(extKeysArray.length >= +params.threshold, `threshold M should be less than or equal to number N of provided extpub keys (M=${+params.threshold}/N=${extKeysArray.length})`);
    } else {
        // just public keys
        const pubKeysArray = params.pubKeys.split(',');
        pubKeysArray.forEach(_ => {
            assert(isValidPublicKey(_), `${_} is not a valid public key for EC secp256k1`);
        });
        assert(pubKeysArray.length >= +params.threshold, `threshold M should be less than or equal to number N of provided public keys (M=${+params.threshold}/N=${pubKeysArray.length})`);
    }
    if (params.output && !['table', 'json'].includes(params.output)) {
        throw new Error(`--output format valid values are 'table' or 'json'`);
    }
    assert(Object.keys(MULTISIG_FUNCS).includes(params.multisigType), `Unknown multisig-type ${params.multisigType}. Valid types are: ${JSON.stringify(Object.keys(MULTISIG_FUNCS))}`);
}