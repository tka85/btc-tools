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
    path?: string
};

type MultisigFunc = (threshold: number, publicKey: Buffer[], network: bitcoinjs.Network) => MultisigRecord;

// Normal multisig
function P2SH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[], network: bitcoinjs.Network): MultisigRecord {
    const res = bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys, network })
    });
    // path (if any) will be added by caller
    return { address: res.address, type: `p2sh-${threshold}-of-${publicKeys.length}`, publicKeys: publicKeys.map(_ => _.toString('hex')), scriptPubKey: res.output.toString('hex'), redeem: res.redeem.output.toString('hex') };
}

// Wrapped segwit multisig
function P2SH_P2WSH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[], network: bitcoinjs.Network): MultisigRecord {
    const res = bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2wsh({
            redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys, network })
        })
    });
    // path (if any) will be added by caller
    return { address: res.address, type: `p2shp2wsh-${threshold}-of-${publicKeys.length}`, publicKeys: publicKeys.map(_ => _.toString('hex')), scriptPubKey: res.output.toString('hex'), redeem: res.redeem.redeem.output.toString('hex') };
}

// Native segwit multisig
function P2WSH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[], network: bitcoinjs.Network): MultisigRecord {
    const res = bitcoinjs.payments.p2wsh({
        redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys, network })
    });
    // path (if any) will be added by caller
    return { address: res.address, type: `p2wsh-${threshold}-of-${publicKeys.length}`, publicKeys: publicKeys.map(_ => _.toString('hex')), redeem: res.redeem.output.toString('hex') };
}

export function deriveMultisig({ multisigFunc, threshold, network, xpubNodes, path, pubKeyBuffers, count, printStdOut = false }: { multisigFunc: MultisigFunc, threshold: number, network: bitcoinjs.Network, xpubNodes?: bip32.BIP32Interface[], path?: DerivationPath, pubKeyBuffers?: Buffer[], count?: number, printStdOut?: boolean }): MultisigRecord[] {
    const multisigResults: MultisigRecord[] = [];

    if (pubKeyBuffers) {
        // Generate single M-of-N multisig address from single set of N public keys
        multisigResults.push(multisigFunc(threshold, pubKeyBuffers, network));
    } else {
        // Generate $count M-of-N multisig addresses from N xpub keys + a path incremented $count times
        let nextMultisig: MultisigRecord;
        for (let i = 0; i < count; i++) {
            pubKeyBuffers = [];
            xpubNodes.forEach(_ => {
                pubKeyBuffers.push(_.derivePath(path.normalizedPathToString()).publicKey);
            });
            nextMultisig = multisigFunc(threshold, pubKeyBuffers, network);
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

function validateParams() {
    if (program.network) {
        assert(['mainnet', 'testnet'].includes(program.network), 'Invalid network. Can only be either "mainnet" or "testnet"');
    }
    assert(Number.isInteger(+program.threshold), 'threshold should be an integer');
    if (program.pubKeys && program.xpubKeys) {
        throw new Error('Either --pub-keys or --xpub-keys can be defined. Not both.');
    } else if (!program.pubKeys && !program.xpubKeys) {
        throw new Error('At least one of either --pub-keys or --xpub-keys must be defined.');
    }

    if (program.xpubKeys) {
        if (!program.path) {
            throw new Error('Missing --path derivation path (required with --xpub-keys');
        }
        if (program.count) {
            assert(Number.isInteger(+program.count), '--count should be an integer');
        }
        const xpubKeys = program.xpubKeys.split(',');
        assert(Array.isArray(xpubKeys), '--xpub-keys should be as a comma separated list of xpub keys');
        assert(xpubKeys.every(isValidMainnetExtKey) || xpubKeys.every(isValidTestnetExtKey), 'Invalid ext key');
    } else {
        // normal public keys
        const pubKeys = program.pubKeys.split(',');
        assert(Array.isArray(pubKeys), '--pub-keys should be as a comma separated list of public keys');
        pubKeys.forEach(_ => assert(isValidPublicKey(_)));
        assert(pubKeys.length >= +program.threshold, 'threshold should be less than number of provided public keys');
    }
    assert(Object.keys(MULTISIG_FUNCS).includes(program.multisigType), `Unknown multisig-type ${program.multisigType}. Valid types are: ${JSON.stringify(Object.keys(MULTISIG_FUNCS))}`);
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
    validateParams();

    const threshold = +program.threshold;
    const multisigFunc = MULTISIG_FUNCS[program.multisigType];
    const pubKeys = program.pubKeys.split(',');
    const xpubKeys = program.xpubKeys.split(',');

    if (xpubKeys.length) {
        const network = xpubKeys.every(isValidMainnetExtKey) ? bitcoinjs.networks.bitcoin : bitcoinjs.networks.testnet;
        const xpubNodes: bip32.BIP32Interface[] = pubKeys.map(_ => bip32.fromBase58(_, network));
        const path = new DerivationPath(program.path);
        const count = +program.count;
        deriveMultisig({ multisigFunc, threshold, network, xpubNodes, path, count, printStdOut: true });
    } else {
        assert(program.network, '--network is required for --pub-keys public keys');
        const network = program.network === 'mainnet' ? bitcoinjs.networks.bitcoin : bitcoinjs.networks.testnet;
        const pubKeyBuffers: Buffer[] = pubKeys.map(_ => Buffer.from(_, 'hex'));
        deriveMultisig({ multisigFunc, threshold, network, pubKeyBuffers, printStdOut: true });
    }
}
