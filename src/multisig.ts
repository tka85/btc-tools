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
import { validateExtKey } from './lib/utils';
import DerivationPath from './lib/DerivationPath';

const MULTISIG_FUNCS = {
    p2sh: P2SH_P2MS_MultisigAddress, // classical msig
    p2shp2wsh: P2SH_P2WSH_P2MS_MultisigAddress, // wrapped segwit msig
    p2wsh: P2WSH_P2MS_MultisigAddress // native segwit
};

type MultisigRecord = {
    address: string,
    type: string,
    publicKeys: string[],
    redeem: string,
    path?: string
};

type MultisigFunc = (threshold: number, publicKey: Buffer[]) => MultisigRecord;

// Normal multisig
function P2SH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[]): MultisigRecord {
    const res = bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys })
    });
    // path (if any) will be added by caller
    return {
        address: res.address,
        type: `p2sh-${threshold}-of-${publicKeys.length}`,
        publicKeys: publicKeys.map(_ => _.toString('hex')),
        redeem: res.redeem.output.toString('hex')
    };
}

// Wrapped segwit multisig
function P2SH_P2WSH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[]): MultisigRecord {
    const res = bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2wsh({
            redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys })
        })
    });
    // path (if any) will be added by caller
    return {
        address: res.address,
        type: `p2shp2wsh-${threshold}-of-${publicKeys.length}`,
        redeem: res.redeem.redeem.output.toString('hex'),
        publicKeys: publicKeys.map(_ => _.toString('hex'))
    };
}

// Native segwit multisig
function P2WSH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[]): MultisigRecord {
    const res = bitcoinjs.payments.p2wsh({
        redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys })
    });
    // path (if any) will be added by caller
    return {
        address: res.address,
        type: `p2wsh-${threshold}-of-${publicKeys.length}`,
        publicKeys: publicKeys.map(_ => _.toString('hex')),
        redeem: res.redeem.output.toString('hex')
    };
}

function deriveMultisig({ multisigFunc, threshold, xpubNodes, path, pubKeyBuffers, count, printStdOut = false }: { multisigFunc: MultisigFunc, threshold: number, xpubNodes?: bip32.BIP32Interface[], path?: DerivationPath, pubKeyBuffers?: Buffer[], count?: number, printStdOut: boolean }): MultisigRecord[] {
    const multisigResults: MultisigRecord[] = [];

    if (pubKeyBuffers) {
        // Generate single M-of-N multisig address from single set of N public keys
        multisigResults.push(multisigFunc(threshold, pubKeyBuffers));
    } else {
        // Generate $count M-of-N multisig addresses from N xpub keys + a path incremented $count times
        let nextMultisig: MultisigRecord;
        for (let i = 0; i < count; i++) {
            pubKeyBuffers = [];
            xpubNodes.forEach(_ => {
                pubKeyBuffers.push(_.derivePath(path.normalizedPathToString()).publicKey);
            });
            nextMultisig = multisigFunc(threshold, pubKeyBuffers);
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
    assert(Number.isInteger(+program.threshold), 'threshold should be an integer');
    const xpubKeys = program.xpubKeys.split(',');
    assert(Array.isArray(xpubKeys), 'ext pub keys should be supplied as a comma separated list');
    xpubKeys.forEach(validateExtKey);
    assert(xpubKeys.length >= +program.threshold, 'threshold should be less than number of provided ext keys');
    assert(Number.isInteger(+program.count), 'count should be an integer');
    assert(Object.keys(MULTISIG_FUNCS).includes(program.multisigType), `Unknown multisig-type ${program.multisigType}. Only valid are "p2sh", "p2shp2wsh", "p2wsh"`);
}

if (require.main === module) {
    // used on command line
    program.requiredOption('-T, --multisig-type <type>', 'one of "p2sh" (classical), "p2shp2wsh" (wrapped segwit), "p2wsh" (native segwit)')
        .requiredOption('-t, --threshold <m>', 'the "M" in "M-of-N" multisig i.e. the required number of signatures')
        .option('-x, --xpub-keys <xpub1,xpub2,...xpubN>', '"N" xpub keys of the "M-of-N" multisig (to generate "--count" multisig addresses); extended pub key formats: [xyYzZ]pub, [tuUvV]pub')
        .option('-p, --path <derivation-path>', 'the path used to derive the addresses in case xpub-keys were provided')
        .option('-P, --pub-keys <pubkey1,pubkey2,...pubkeyN>', '"N" public keys of the "M-of-N" multisig (to generate single multisig address)')
        .option('-c, --count <number>', 'number of multisig addresses to derive from given path', 5);

    program.parse(process.argv);
    validateParams();

    const threshold = +program.threshold;
    const multisigFunc = MULTISIG_FUNCS[program.multisigType];

    if (program.publicKeys) {
        const pubKeyBuffers: Buffer[] = program.pubKeys.map(_ => Buffer.from(_, 'hex'));
        deriveMultisig({ multisigFunc, threshold, pubKeyBuffers, printStdOut: true });
    } else if (program.xpubKeys && program.path && program.count) {
        const xpubNodes: bip32.BIP32Interface[] = program.xpubKeys.split(',').map(_ => bip32.fromBase58(_));
        const path = new DerivationPath(program.path);
        const count = +program.count;
        deriveMultisig({ multisigFunc, threshold, xpubNodes, path, count, printStdOut: true });
    } else {
        throw new Error('Must provide either (a) "--xpub-keys" and "--path" or (b) "--pub-keys"');
    }
}

export default deriveMultisig;
