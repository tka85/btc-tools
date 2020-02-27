/**
 * Scenario 1: Given N extended pub keys (mainnet: 'xpub', 'ypub', 'Ypub', 'zpub', 'Zpub' or testnet: 'tpub', 'upub', 'Upub', 'vpub', 'Vpub')
 * a derivation path and a threshold M, it returns a list of M-of-N multisig addresses.
 *
 * Scenario 2: Given single set of N public keys and a threshold M, it returns a single M-of-N multisig address.
 *
 * Supported multisig formats:
 *  - p2sh (classical multisig)
 *  - p2wsh (native segwit multisig)
 *  - p2sh(p2wsh) (wrapped segwit multisig)
 */
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import program = require('commander');
import assert = require('assert');
import { isValidExtKey, isValidPublicKey, isValidMainnetExtKey, isValidTestnetExtKey } from './lib/utils';
import { DerivationPath } from './lib/DerivationPath';

export const MULTISIG_FUNCS = {
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
    network: string,
    xpubKeys?: string[],
    path?: DerivationPath,
    count?: number,
    pubKeys?: string[],
    printStdOut?: boolean
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

export function deriveMultisig({ multisigType, threshold, network, xpubKeys, path, count, pubKeys, printStdOut = false }: MultisigParams): MultisigRecord[] {
    const multisigResults: MultisigRecord[] = [];

    validateParams({ multisigType, threshold, network, xpubKeys, path, count, pubKeys });

    const multisigFunc: MultisigFunc = MULTISIG_FUNCS[multisigType];
    let xpubNodes: bip32.BIP32Interface[];
    let pubKeyBuffers: Buffer[];
    let bjNetwork: bitcoinjs.Network;

    if (xpubKeys) {
        // Deduce network from type of xpub keys
        bjNetwork = xpubKeys.every(isValidMainnetExtKey) ? bitcoinjs.networks.bitcoin : bitcoinjs.networks.testnet;
        xpubNodes = xpubKeys && xpubKeys.map(_ => bip32.fromBase58(_, bjNetwork));
    } else if (pubKeys) {
        bjNetwork = network === 'mainnet' ? bitcoinjs.networks.bitcoin : bitcoinjs.networks.testnet;
        pubKeyBuffers = pubKeys.map(_ => Buffer.from(_, 'hex'));
    }

    if (pubKeyBuffers) {
        // Generate single M-of-N multisig address from single set of N public keys
        multisigResults.push(multisigFunc(threshold, pubKeyBuffers, bjNetwork));
    } else {
        // Generate $count M-of-N multisig addresses from N xpub keys + a path incremented $count times
        let nextMultisig: MultisigRecord;
        for (let i = 0; i < count; i++) {
            pubKeyBuffers = [];
            xpubNodes.forEach(_ => {
                pubKeyBuffers.push(_.derivePath(path.normalizedPathToString()).publicKey);
            });
            nextMultisig = multisigFunc(threshold, pubKeyBuffers, bjNetwork);
            nextMultisig.path = path.toString();
            multisigResults.push(nextMultisig);
            path.incrementPath();
        }
    }
    if (printStdOut) {
        console.table(multisigResults);
    }
    return multisigResults;
}

function validateParams(params: MultisigParams) {
    if (params.network) {
        assert(['mainnet', 'testnet'].includes(params.network), 'Invalid network. Can only be either "mainnet" or "testnet"');
    }
    assert(Number.isInteger(+params.threshold), 'threshold should be an integer');
    if (params.pubKeys && params.xpubKeys) {
        throw new Error('Either --pub-keys or --xpub-keys can be defined. Not both.');
    } else if (!params.pubKeys && !params.xpubKeys) {
        throw new Error('At least one of either --pub-keys or --xpub-keys must be defined.');
    }

    if (params.xpubKeys) {
        if (!params.path) {
            throw new Error('Missing --path derivation path (required with --xpub-keys');
        }
        if (params.count) {
            assert(Number.isInteger(+params.count), '--count should be an integer');
        }
        const xpubKeys = params.xpubKeys;
        assert(Array.isArray(xpubKeys), '--xpub-keys should be a comma separated list of xpub keys');
        assert(xpubKeys.every(_ => isValidExtKey(_)), 'Not valid ext key');
        assert(xpubKeys.every(isValidMainnetExtKey) || xpubKeys.every(isValidTestnetExtKey), 'Ext keys should all be from same network i.e. all "mainnet" or all "testnet"');
    } else {
        // normal public keys
        const pubKeys = params.pubKeys;
        assert(Array.isArray(pubKeys), '--pub-keys should be as a comma separated list of public keys');
        pubKeys.every(_ => isValidPublicKey(_));
        assert(pubKeys.length >= +params.threshold, 'threshold should be less than number of provided public keys');
    }
    assert(Object.keys(MULTISIG_FUNCS).includes(params.multisigType), `Unknown multisig-type ${params.multisigType}. Valid types are: ${JSON.stringify(Object.keys(MULTISIG_FUNCS))}`);
}

if (require.main === module) {
    // used on command line
    program.requiredOption('-T, --multisig-type <type>', 'one of "p2sh" (classical), "p2shp2wsh" (wrapped segwit), "p2wsh" (native segwit)')
        .requiredOption('-t, --threshold <m>', 'the "M" in "M-of-N" multisig i.e. the required number of signatures')
        .option('-x, --xpub-keys <xpub1,xpub2,...xpubN>', '"N" xpub keys for "M-of-N" multisig; requires "--path" and optionally "--count"; recognizes key formats: [xyYzZ]pub, [tuUvV]pub')
        .option('-p, --path <derivation-path>', '(required in case of xpub keys) the path used to derive the addresses')
        .option('-c, --count <number>', '(only in case xpub keys are provided) number of multisig addresses to derive', 5)
        .option('-P, --pub-keys <pubkey1,pubkey2,...pubkeyN>', '"N" simple public keys for "M-of-N" multisig')
        .option('-n, --network <mainnet|testnet>', 'the BTC network which can be "mainnet" or "testnet" (required in case of public keys; optional in case of xpub keys)');

    program.parse(process.argv);
    validateParams({ network: program.network, threshold: program.threshold, pubKeys: program.pubKeys, xpubKeys: program.xpubKeys, path: program.path, count: program.count, multisigType: program.multisigType });

    const threshold = +program.threshold;
    const multisigType = program.multisigType;
    const pubKeys = program.pubKeys ? program.pubKeys.split(',') : null;
    const xpubKeys = program.xpubKeys ? program.xpubKeys.split(',') : null;

    if (xpubKeys) {
        const network = xpubKeys.every(isValidMainnetExtKey) ? 'mainnet' : 'testnet';
        const path = new DerivationPath(program.path);
        const count = +program.count;
        deriveMultisig({ multisigType, threshold, network, xpubKeys, path, count, printStdOut: true });
    } else {
        assert(program.network, '--network is required for --pub-keys public keys');
        deriveMultisig({ multisigType, threshold, network: program.network, pubKeys, printStdOut: true });
    }
}
