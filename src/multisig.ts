/**
 * Given n extended pub keys (mainnet: 'xpub', 'ypub', 'Ypub', 'zpub', 'Zpub' or testnet: 'tpub', 'upub', 'Upub', 'vpub', 'Vpub')
 * and a threshold of m, it returns a list of m-of-n multisig addresses with format:
 *  - p2sh (original multisig)
 *  - p2wsh (native segwit multisig)
 *  - p2sh(p2wsh) (wrapped segwit multisig)
 */
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import program = require('commander');
import assert = require('assert');
import { isMainnetXpubKey, isTestnetXpubKey, MAINNET_XPUB_PREFIXES, TESTNET_XPUB_PREFIXES } from './lib/utils';
import DerivationPath from './lib/DerivationPath';

const MULTISIGS = {
    p2sh: P2SH_P2MS_MultisigAddress, // normal msig
    p2shp2wsh: P2SH_P2WSH_P2MS_MultisigAddress, // wrapped segwit msig
    p2wsh: P2WSH_P2MS_MultisigAddress // native segwit
};

type MultisigRecord = {
    address: string,
    type: string,
    path?: string
};

// Normal multisig
function P2SH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[]): MultisigRecord {
    const res = bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys })
    });
    return { address: res.address, type: `p2sh-${threshold}-of-${publicKeys.length}` };
}

// Wrapped segwit multisig
function P2SH_P2WSH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[]): MultisigRecord {
    const res = bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2wsh({
            redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys })
        })
    });
    return { address: res.address, type: `p2shp2wsh-${threshold}-of-${publicKeys.length}` };
}

// Native segwit multisig
function P2WSH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[]): MultisigRecord {
    const res = bitcoinjs.payments.p2wsh({
        redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys })
    });
    return { address: res.address, type: `p2wsh-${threshold}-of-${publicKeys.length}` };
}

export function deriveMultisigAddresses({ multisigGenerator, threshold, xpubNodes, path, count = 5, printStdOut = false }: { multisigGenerator: Function, threshold: number, xpubNodes: bip32.BIP32Interface[], path: DerivationPath, count: number, printStdOut: boolean }): MultisigRecord[] {
    const multisigs: MultisigRecord[] = [];
    let nextMultisig: MultisigRecord;
    for (let i = 0; i < count; i++) {
        const publicKeys: Buffer[] = [];
        xpubNodes.forEach(_ => {
            publicKeys.push(_.derivePath(path.normalizedPathToString()).publicKey);
        });
        // pubkey order matters in multisig => sort them
        publicKeys.sort();
        nextMultisig = multisigGenerator(threshold, publicKeys);
        nextMultisig.path = path.toString();
        console.log(`>>> nextMultisigRecord`, nextMultisig);
        multisigs.push(nextMultisig);
        path.incrementPath();
    }
    if (printStdOut) {
        console.table(multisigs);
    }
    return multisigs;
}

if (require.main === module) {
    // used on command line
    program.requiredOption('-T, --multisig-type <type>', 'one of "p2sh" (classical), "p2shp2wsh" (wrapped segwit) or "p2wsh" (native segwit)')
        .requiredOption('-t, --threshold <m>', 'the "M" in "M-of-N" multisig i.e. the required number of signatures')
        .requiredOption('-x, --xpub-keys <xpub1,xpub2,...xpubN>', 'in an "M-of-N" multisig, should provide "N" xpub keys (all extended pub key formats supported: [xyYzZ]pub, [tuUvV]pub)')
        .requiredOption('-p, --path <derivation-path>', 'the path used to derive the addresses')
        .option('-c, --count <number>', 'number of multisig addresses to derive from given path', 5);

    program.parse(process.argv);
    const threshold = Number(program.threshold);
    assert(Number.isInteger(threshold), 'threshold should be an integer');
    const xpubKeys = program.xpubKeys.split(',');
    assert(Array.isArray(xpubKeys), 'ext pub keys should be supplied as a comma separated list');
    assert(xpubKeys.length >= threshold, `provided threshold (${threshold}) should be <= provided number of xpub keys (${xpubKeys.length})`);
    xpubKeys.forEach(_ => {
        const prefix = _.slice(0, 4);
        assert.equal(_.length, 111, `provided xpub key has invalid length`);
        assert(isMainnetXpubKey(prefix) || isTestnetXpubKey(prefix), `provided xpub key has unknown prefix ${prefix}; recognize only prefixes ${JSON.stringify(MAINNET_XPUB_PREFIXES.concat(TESTNET_XPUB_PREFIXES))}`);
    });
    const path = new DerivationPath(program.path);
    const count = Number(program.count);
    assert(Number.isInteger(count), 'count should be an integer');
    const xpubNodes = xpubKeys.map(_ => bip32.fromBase58(_));
    assert(Object.keys(MULTISIGS).includes(program.multisigType), `Unknown multisig-type ${program.multisigType}. Only valid are "p2sh", "p2shp2wsh", "p2wsh"`);
    deriveMultisigAddresses({ multisigGenerator: MULTISIGS[program.multisigType], threshold, xpubNodes, path, count, printStdOut: true });
}