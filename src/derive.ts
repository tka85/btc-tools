/**
 * Given extendsible key and a path, it derives addresses (bip32)
 */
import assert = require('assert');
import program = require('commander');
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import { isMainnetExtKey, normalizeExtKey, getP2PKH, getP2SHP2WPKH, getP2WPKH, validateExtKey, } from './lib/utils';
import DerivationPath from './lib/DerivationPath';

type Row = {
    path?: string,
    depth?: number,
    legacy?: string,
    p2sh_segwit?: string,
    bech32?: string,
    xprv?: string,
    xpub?: string,
    privkey?: string,
    pubkey?: string
};

const COLUMNS = ['path', 'depth', 'legacy', 'p2sh_segwit', 'wrapped_segwit', 'bech32', 'xprv', 'xpub', 'privkey', 'pubkey'];

function derive({ key, path, cols = 'path,depth,legacy,p2sh_segwit,bech32', includeRoot = false, count = 5, hardenedChildren = false, printStdout = false }: { key: string, path: string, cols?: string, includeRoot?: boolean, count?: number, hardenedChildren: boolean, printStdout?: boolean }) {
    assert(key, 'missing extended key');
    assert(path || path === '', 'missing or invalid path');
    const network = isMainnetExtKey(key) ? bitcoinjs.networks.bitcoin : bitcoinjs.networks.testnet;
    const res: Row[] = [];
    const derivationPath = new DerivationPath(path, hardenedChildren);
    key = normalizeExtKey(key);

    const rootNode = bip32.fromBase58(key, network);

    assert(cols);
    const colsArray = cols.split(',');
    assert(colsArray.length);

    if (includeRoot) {
        // Add a row for given ext key as well
        res.push(evalNextRow(rootNode, '', network, colsArray));
    }

    for (let i = 0; i < count; i++) {
        const childNode = rootNode.derivePath(derivationPath.toString());
        res.push(evalNextRow(childNode, derivationPath.toString(), network, colsArray));
        derivationPath.incrementPath();
    }

    if (printStdout) {
        console.table(res);
    }
    return res;
}

function evalNextRow(node: bip32.BIP32Interface, derivationPath: string, network: bitcoinjs.Network, cols: string[]): Row {
    const nextRow: Row = {};
    for (const c of cols) {
        switch (c) {
            case 'path':
                nextRow.path = `m/${derivationPath}`;
                break;
            case 'legacy':
                nextRow.legacy = getP2PKH(node, network);
                break;
            case 'p2sh_segwit':
            case 'wrapped_segwit':
                nextRow.p2sh_segwit = getP2SHP2WPKH(node, network);
                break;
            case 'bech32':
            case 'native_segwit':
                nextRow.bech32 = getP2WPKH(node, network);
                break;
            case 'xprv':
                nextRow.xprv = node.isNeutered() ? null : node.toBase58();
                break;
            case 'xpub':
                nextRow.xpub = node.neutered().toBase58();
                break;
            case 'privkey':
                nextRow.privkey = node.isNeutered() ? null : node.toWIF();
                break;
            case 'pubkey':
                nextRow.pubkey = node.publicKey.toString('hex');
                break;
            case 'depth':
                nextRow.depth = node.depth;
                break;
            default:
                throw new Error('Invalid column name:' + JSON.stringify(c));
        }
    }
    return nextRow;
}

function validateParams(): void {
    validateExtKey(program.extKey);
    program.cols.split(',').forEach(_ => {
        if (!COLUMNS.includes(_)) {
            throw new Error(`Unknown column "${_}"; Recognized columns: ${JSON.stringify(COLUMNS)}`)
        }
    });
    if (!Number.isInteger(+program.count)) {
        throw new Error(`Count of derived addresses "${program.count}" is not an integer`);
    }
}

if (require.main === module) {
    // used on command line
    program.requiredOption('-x, --ext-key <base58-extended-key>', 'an extended priv or pub key; recognized types: [xyYzZ]prv, [xyYzZ]pub, [tuUvV]prv, [tuUvV]pub')
        .requiredOption('-p, --path <derivation-path>', 'can be "" (implies "m") or start with "m" or "<number>""; hardened components are denoted by "\'" or "h"; for paths with hardened components, priv key is necessary')
        .option('-C, --cols <column-names>', 'comma separated list of: "path", "legacy", p2sh_segwit" (or synonym "wrapped_segwit"), "bech32" (or synonym "native_segwit"), "xprv", "xpub", "privkey", "pubkey", "depth"', 'path,depth,legacy,p2sh_segwit,bech32')
        .option('-R, --include-root', 'whether to include the node of the igven extended key as well', false)
        .option('-c, --count <number>', 'number of addresses to derive', 5)
        .option('-H, --hardened-children', 'derive hardened children under given path', false);
    program.parse(process.argv);
    validateParams();
    derive({ key: program.extKey, path: program.path, cols: program.cols, includeRoot: program.includeRoot, count: program.count, hardenedChildren: program.hardenedChildren, printStdout: true });
}

// used as a module
export default derive;
