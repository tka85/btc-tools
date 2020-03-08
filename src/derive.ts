/**
 * Given extendsible key and a path, it derives addresses (bip32)
 */
import assert = require('assert');
import program = require('commander');
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import { normalizeExtKey, getP2PKH, getP2SHP2WPKH, getP2WPKH, isValidExtKey, isValidMainnetExtKey } from './lib/utils';
import { DerivationPath } from './lib/DerivationPath';

type Row = {
    path?: string,
    depth?: number,
    p2pkh?: string,
    p2sh_p2wpkh?: string,
    p2wpkh?: string,
    xprv?: string,
    xpub?: string,
    privkey?: string,
    pubkey?: string
    wif?: string,
    fingerprint?: string
};

type deriveParams = {
    extKey: string,
    path: string,
    cols?: string,
    includeRoot?: boolean,
    count?: number,
    hardenedChildren?: boolean,
    printStdout?: boolean
};

const COLUMNS = ['path', 'depth', 'legacy', 'p2pkh', 'p2sh_p2wpkh', 'bech32', 'p2wpkh', 'xprv', 'xpub', 'privkey', 'pubkey', 'wif', 'fingerprint'];
const DEFAULT_COLS = 'path,depth,p2pkh,p2sh_p2wpkh,p2wpkh,wif,pubkey';

export function derive({ extKey, path, cols = DEFAULT_COLS, includeRoot = false, count = 5, hardenedChildren = false, printStdout = false }: deriveParams) {
    validateParams({ extKey, cols, count });
    // Validation already established it's a valid ext key
    const network = isValidMainnetExtKey(extKey) ? bitcoinjs.networks.bitcoin : bitcoinjs.networks.testnet;
    extKey = normalizeExtKey(extKey);
    const rootNode = bip32.fromBase58(extKey, network);
    const dPath = new DerivationPath(path, hardenedChildren)
    const res: Row[] = [];

    assert(cols);
    const colsArray = cols.split(',');
    assert(colsArray.length);

    if (includeRoot) {
        // Add a row for given ext key as well
        res.push(evalNextRow(rootNode, '', network, colsArray));
    }

    for (let i = 0; i < count; i++) {
        const childNode = rootNode.derivePath(dPath.toString());
        res.push(evalNextRow(childNode, dPath.toString(), network, colsArray));
        dPath.incrementPath();
    }

    if (printStdout) {
        console.table(res);
    }
    return res;
}

function evalNextRow(node: bip32.BIP32Interface, path: string, network: bitcoinjs.Network, cols: string[]): Row {
    const nextRow: Row = {};
    for (const c of cols) {
        switch (c) {
            case 'path':
                nextRow.path = `m/${path}`;
                break;
            case 'legacy':
            case 'p2pkh':
                nextRow.p2pkh = getP2PKH(node, network);
                break;
            case 'p2sh_p2wpkh':
                nextRow.p2sh_p2wpkh = getP2SHP2WPKH(node, network);
                break;
            case 'bech32':
            case 'p2wpkh':
                nextRow.p2wpkh = getP2WPKH(node, network);
                break;
            case 'xprv':
                nextRow.xprv = node.isNeutered() ? null : node.toBase58();
                break;
            case 'xpub':
                nextRow.xpub = node.neutered().toBase58();
                break;
            case 'privkey':
                nextRow.privkey = node.privateKey.toString('hex');
                break;
            case 'pubkey':
                nextRow.pubkey = node.publicKey.toString('hex');
                break;
            case 'depth':
                nextRow.depth = node.depth;
                break;
            case 'wif':
                nextRow.wif = node.isNeutered() ? null : node.toWIF();
                break;
            case 'fingerprint':
                nextRow.fingerprint = node.fingerprint.toString('hex');
                break;
            default:
                throw new Error('Invalid column name:' + JSON.stringify(c));
        }
    }
    return nextRow;
}

function validateParams(params): void {
    if (!isValidExtKey(params.extKey)) {
        throw new Error(`Invalid param for ext key: "${params.extKey}"`);
    };
    params.cols.split(',').forEach(_ => {
        if (!COLUMNS.includes(_)) {
            throw new Error(`Unknown column "${_}"; Recognized columns: ${JSON.stringify(COLUMNS)}`)
        }
    });
    if (!Number.isInteger(+params.count)) {
        throw new Error(`--count of derived addresses "${params.count}" is not an integer`);
    }
}

if (require.main === module) {
    // used on command line
    program.requiredOption('-x, --ext-key <base58-extended-key>', 'an extended priv or pub key; recognized types: [xyYzZ]prv, [xyYzZ]pub, [tuUvV]prv, [tuUvV]pub')
        .requiredOption('-p, --path <derivation-path>', 'can be "" (implies "m") or start with "m" or "<number>""; hardened components are denoted by "\'" or "h"; for paths with hardened components, priv key is necessary')
        .option('-C, --cols <column-names>', 'comma separated list of: "path", "depth", "p2pkh" (or synonym "legacy"), "p2sh_p2wpkh", "p2wpkh" (or synonym "bech32"), "xprv", "xpub", "privkey", "wif", "pubkey"', DEFAULT_COLS)
        .option('-R, --include-root', 'whether to include the node of the igven extended key as well', false)
        .option('-c, --count <number>', 'number of addresses to derive', 5)
        .option('-H, --hardened-children', 'derive hardened children under given path', false);
    program.parse(process.argv);
    validateParams({ extKey: program.extKey, cols: program.cols, count: program.count });
    derive({ extKey: program.extKey, path: program.path, cols: program.cols, includeRoot: program.includeRoot, count: program.count, hardenedChildren: program.hardenedChildren, printStdout: true });
}
