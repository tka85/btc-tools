/**
 * Given extendsible key and a path, it derives addresses (bip32)
 */
import assert = require('assert');
import program = require('commander');
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import { normalizeExtKey, getP2PKH, getP2SHP2WPKH, getP2WPKH, isValidExtKey, isValidMainnetExtKey, NETWORKS } from './lib/utils';
import { DerivationPath } from './lib/DerivationPath';

type Row = {
    path?: string,
    depth?: number,
    legacy?: string, // synonym for p2pkh
    p2pkh?: string,
    p2sh_p2wpkh?: string,
    bech32?: string, // synonym for p2wpkh
    p2wpkh?: string,
    xprv?: string,
    xpub?: string,
    privkey?: string,
    pubkey?: string,
    pubkey_hash?: string,
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
    output?: 'table' | 'json',
    networkName?: 'btc' | 'btctest' | 'ltc' | 'ltctest'
};

const COLUMNS = ['path', 'depth', 'p2pkh', 'p2sh_p2wpkh', 'p2wpkh', 'xprv', 'xpub', 'privkey', 'pubkey', 'pubkey_hash', 'wif', 'fingerprint'];
const COLUMN_SYNONYMS = ['legacy', 'bech32',];
const DEFAULT_COLUMNS = 'path,depth,p2pkh,p2sh_p2wpkh,p2wpkh,wif,pubkey';
const ALL_COLUMNS = COLUMNS.concat(COLUMN_SYNONYMS);

export function derive({ extKey, path = 'm/', cols = DEFAULT_COLUMNS, includeRoot = false, count = 5, hardenedChildren = false, output = null, networkName = 'btc' }: deriveParams) {
    assert(extKey, 'missing extKey');
    assert(path, 'missing path');
    // Validate params that can be validated
    validateParams({ extKey, cols, count, output, networkName });
    if (cols === 'all') {
        cols = ALL_COLUMNS.join(',');
    }
    extKey = normalizeExtKey(extKey);
    const network = NETWORKS[networkName];
    const rootNode = bip32.fromBase58(extKey, network);
    const dPath = new DerivationPath(path, hardenedChildren)
    const result: Row[] = [];

    assert(cols);
    const colsArray = cols.split(',');
    assert(colsArray.length);

    if (includeRoot) {
        // Add a row for given ext key as well
        result.push(evalNextRow(rootNode, '', network, colsArray));
    }

    for (let i = 0; i < count; i++) {
        const childNode = rootNode.derivePath(dPath.toString());
        result.push(evalNextRow(childNode, dPath.toString(), network, colsArray));
        dPath.incrementPath();
    }

    switch (output) {
        case 'table':
            console.table(result);
            return;
        case 'json':
            console.log(result);
            return;
        default:
            return result;
    }
}

function evalNextRow(node: bip32.BIP32Interface, path: string, network: bitcoinjs.Network, cols: string[]): Row {
    const nextRow: Row = {};
    for (const c of cols) {
        switch (c) {
            case 'path':
                nextRow.path = `m/${path}`;
                break;
            case 'legacy': // synonym for 'p2pkh'
                nextRow.legacy = getP2PKH(node, network);
                break;
            case 'p2pkh':
                nextRow.p2pkh = getP2PKH(node, network);
                break;
            case 'p2sh_p2wpkh':
                nextRow.p2sh_p2wpkh = getP2SHP2WPKH(node, network);
                break;
            case 'bech32': // synonym for 'p2wpkh'
                nextRow.bech32 = getP2WPKH(node, network);
                break;
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
                nextRow.privkey = node.privateKey && node.privateKey.toString('hex') || null;
                break;
            case 'pubkey':
                nextRow.pubkey = node.publicKey.toString('hex');
                break;
            case 'pubkey_hash':
                nextRow.pubkey_hash = bitcoinjs.crypto.hash160(node.publicKey).toString('hex');
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
        if (_ !== 'all' && !COLUMNS.includes(_) && !COLUMN_SYNONYMS.includes(_)) {
            throw new Error(`Unknown column "${_}"; Recognized columns: ${JSON.stringify(ALL_COLUMNS)}`)
        }
    });
    if (!Number.isInteger(+params.count)) {
        throw new Error(`--count of derived addresses "${params.count}" is not an integer`);
    }
    if (params.output && !['table', 'json'].includes(params.output)) {
        throw new Error(`--output format valid values are "table" or "json"`);
    }
    if (params.network && !NETWORKS[params.networkName]) {
        throw new Error(`Invalid network name ${params.networkName}. Valid values are 'btc', 'btctest', 'ltc' or 'ltctest'.`);
    }
}

if (require.main === module) {
    // used on command line
    program.requiredOption('-x, --ext-key <base58-extended-key>', 'an extended priv or pub key; recognized types: [xyYzZ]prv, [xyYzZ]pub, [tuUvV]prv, [tuUvV]pub')
        .option('-p, --path <derivation-path>', 'can be omitted (implies "m/") or start with "m" or "<number>""; hardened components are denoted by "\'" or "h"; for paths with hardened components, a private key (see -x) is necessary', 'm/')
        .option('-C, --cols <column-names>', '"all" or comma separated list of: "path", "depth", "p2pkh" (or synonym "legacy"), "p2sh_p2wpkh", "p2wpkh" (or synonym "bech32"), "xprv", "xpub", "privkey", "wif", "pubkey", "pubkey_hash", "fingerprint"', DEFAULT_COLUMNS)
        .option('-R, --include-root', 'whether to include the node of the given extended key as well', false)
        .option('-c, --count <number>', 'number of addresses to derive', 5)
        .option('-H, --hardened-children', 'derive hardened children under given path', false)
        .option('-N, --network-name <btc|btctest|ltc|ltctest>', 'coin network; one of "btc", "btctest", "ltc" or "ltctest"', 'btc')
        .option('-o, --output <table|json>', 'format for printing results; one of "table" or "json"', 'table');
    program.parse(process.argv);
    if (program.cols === 'all') {
        program.cols = ALL_COLUMNS.join(',');
    }
    validateParams(program);
    derive({
        extKey: program.extKey,
        path: program.path,
        cols: program.cols,
        includeRoot: program.includeRoot,
        count: program.count,
        hardenedChildren: program.hardenedChildren,
        output: program.output,
        networkName: program.networkName
    });
}
