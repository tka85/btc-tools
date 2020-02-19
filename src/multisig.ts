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

const MULTISIG = {
    P2SH: 0, // normal msig
    P2SH_P2WSH_P2MS: 1, // wrapped segwit msig
    P2WSH_P2MS: 2 // native segwit
};

// Normal multisig
function P2SH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[]): string {
    return bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys })
    }).address;
}

// Wrapped segwit multisig
function P2SH_P2WSH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[]): string {
    return bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2wsh({
            redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys })
        })
    }).address;
}

// Native segwit multisig
function P2WSH_P2MS_MultisigAddress(threshold: number, publicKeys: Buffer[]): string {
    return bitcoinjs.payments.p2wsh({
        redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys })
    }).address;
}

export function deriveMultisigAddresses({ multisigType, threshold, xpubNodes, path, count }: { multisigType: number, threshold: number, xpubNodes: bip32.BIP32Interface[], path: DerivationPath, count: number }): string[] {
    const multisigAddresses = [];
    let addressFunction;
    switch (multisigType) {
        case MULTISIG.P2SH: // normal msig
            addressFunction = P2SH_P2MS_MultisigAddress;
            break;
        case MULTISIG.P2SH_P2WSH_P2MS: // wrapped segwit msig
            addressFunction = P2SH_P2WSH_P2MS_MultisigAddress;
            break;
        case MULTISIG.P2WSH_P2MS: // native segwit
            addressFunction = P2WSH_P2MS_MultisigAddress;
            break;
        default:
            throw new Error('Unknown type of multisig');
    }
    for (let i = 0; i < count; i++) {
        const publicKeys: Buffer[] = [];
        xpubNodes.forEach(_ => {
            publicKeys.push(_.derivePath(path.normalizedPathToString()).publicKey);
        });
        // pubkey order matters in multisig => sort them
        publicKeys.sort();
        const address = addressFunction(threshold, publicKeys);
        console.log(`>>> [${threshold}-of-${xpubNodes.length} multisig]; PATH toString()`, path.toString(), ' / normalizedPathToString()', path.normalizedPathToString(), ' / PUBKEY', publicKeys.map(_ => _.toString('hex')), ' / ADDRESS', address);
        multisigAddresses.push(address);
        path.incrementPath();
    }
    return multisigAddresses;
}

if (require.main === module) {
    // used on command line
    program.requiredOption('-t, --threshold <m>', 'in an "M-of-N" multisig, threshold is the value of "M": the required number of signatures')
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
    deriveMultisigAddresses({ multisigType: MULTISIG.P2SH, threshold, xpubNodes, path, count });
    deriveMultisigAddresses({ multisigType: MULTISIG.P2SH_P2WSH_P2MS, threshold, xpubNodes, path, count });
    deriveMultisigAddresses({ multisigType: MULTISIG.P2WSH_P2MS, threshold, xpubNodes, path, count });
}