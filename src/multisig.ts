/**
 * Given n extended pub keys (mainnet: 'xpub', 'ypub', 'Ypub', 'zpub', 'Zpub' or testnet: 'tpub', 'upub', 'Upub', 'vpub', 'Vpub')
 * and a threshold of m, it returns a list of m-of-n multisig addresses with format:
 *  - p2sh (original multisig)
 *  - p2wsh (native segwit multisig)
 *  - p2sh(p2wsh) (wrapped segwit multisig)
 */
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import bip39 = require('bip39');
import program = require('commander');
import assert = require('assert');
import { isMainnetXpubKey, isTestnetXpubKey, MAINNET_XPUB_PREFIXES, TESTNET_XPUB_PREFIXES } from './lib/utils';
import DerivationPath from './lib/DerivationPath';

export function deriveP2SHMultisigAddresses({ threshold, xpubNodes, path, count }: { threshold: number, xpubNodes: bip32.BIP32Interface[], path: DerivationPath, count: number }): string[] {
    const addresses = [];
    for (let i = 0; i < count; i++) {
        const publicKeys: Buffer[] = [];
        xpubNodes.forEach(_ => {
            publicKeys.push(_.derivePath(path.normalizedPathToString()).publicKey);
        });
        // pubkey order matters in multisig => sort them
        publicKeys.sort();
        const { address } = bitcoinjs.payments.p2sh({
            redeem: bitcoinjs.payments.p2ms({ m: threshold, pubkeys: publicKeys })
        });
        console.log(`>>> [${threshold}-of-${xpubNodes.length} multisig]; PATH toString()`, path.toString(), ' / normalizedPathToString()', path.normalizedPathToString(), ' / ADDRESS', address);
        addresses.push(address);
        path.incrementPath();
    }
    return addresses;
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
    deriveP2SHMultisigAddresses({ threshold, xpubNodes, path, count })
}