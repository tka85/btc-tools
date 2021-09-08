/**
 * Given extendsible key and a path, it derives addresses (bip32)
 */
import assert = require('assert');
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import { isValidExtKey, NETWORKS } from './lib/utils';
import { DerivationPath } from './lib/DerivationPath';
import { normalizeExtKey } from './convert';

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

type DeriveParams = {
    extKey: string,
    path: string,
    cols?: string,
    includeRoot?: boolean,
    count?: number,
    hardenedChildren?: boolean,
    output?: 'table' | 'json',
    network: 'btc' | 'btctest' | 'ltc' | 'ltctest'
};

const COLUMNS = ['path', 'depth', 'p2pkh', 'p2sh_p2wpkh', 'p2wpkh', 'xprv', 'xpub', 'privkey', 'pubkey', 'pubkey_hash', 'wif', 'fingerprint'];
const COLUMN_SYNONYMS = ['legacy', 'bech32',];
const DEFAULT_COLUMNS = 'path,depth,p2pkh,p2sh_p2wpkh,p2wpkh,wif,pubkey';
const ALL_COLUMNS = COLUMNS.concat(COLUMN_SYNONYMS);

/**
 * Evaluate legacy address from HD node or ECPair or public key in hex as string or public key buffer
 */
const getP2PKH = (from: bip32.BIP32Interface | bitcoinjs.ECPairInterface | string | Buffer, network: bitcoinjs.Network): string => {
    let pubkey: bip32.BIP32Interface | bitcoinjs.ECPairInterface | string | Buffer;
    if (typeof from === 'string' || from instanceof String) {
        pubkey = Buffer.from(from as string, 'hex');
    } else if (Buffer.isBuffer(from)) {
        // Already a pubkey buffer
        pubkey = from;
    } else {
        // HD node or ECPair
        pubkey = from.publicKey;
    }
    return bitcoinjs.payments.p2pkh({ pubkey, network }).address;
};

/**
 * Evaluate p2sh wrapped segwit address from HD node or ECPair or public key in hex as string or public key buffer
 */
const getP2SHP2WPKH = (from: bip32.BIP32Interface | bitcoinjs.ECPairInterface | string | Buffer, network: bitcoinjs.Network): string => {
    let pubkey: bip32.BIP32Interface | bitcoinjs.ECPairInterface | string | Buffer;
    if (typeof from === 'string' || from instanceof String) {
        pubkey = Buffer.from(from as string, 'hex');
    } else if (Buffer.isBuffer(from)) {
        // Already a pubkey buffer
        pubkey = from;
    } else {
        // HD node or ECPair
        pubkey = from.publicKey;
    }
    return bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2wpkh({ pubkey, network })
    }).address;
};

/**
 * Evaluate native segwit (bech32) address from HD node or ECPair or public key in hex as string or public key buffer
 */
const getP2WPKH = (from: bip32.BIP32Interface | bitcoinjs.ECPairInterface | string | Buffer, network: bitcoinjs.Network): string => {
    let pubkey: bip32.BIP32Interface | bitcoinjs.ECPairInterface | string | Buffer;
    if (typeof from === 'string' || from instanceof String) {
        pubkey = Buffer.from(from as string, 'hex');
    } else if (Buffer.isBuffer(from)) {
        // Already a pubkey buffer
        pubkey = from;
    } else {
        // HD node or ECPair
        pubkey = from.publicKey;
    }
    return bitcoinjs.payments.p2wpkh({ pubkey, network }).address;
};

export const derive = ({ extKey, path = 'm/', cols = DEFAULT_COLUMNS, includeRoot = false, count = 5, hardenedChildren = false, output = null, network }: DeriveParams): Row[] | undefined => {
    assert(extKey, 'missing extKey');
    assert(path, 'missing path');
    // Validate params that can be validated
    validateParams({ extKey, path, cols, count, output, network });
    if (cols === 'all') {
        cols = ALL_COLUMNS.join(',');
    }
    extKey = normalizeExtKey(extKey);
    const rootNode = bip32.fromBase58(extKey, NETWORKS[network]);
    const dPath = new DerivationPath(path, hardenedChildren);
    const result: Row[] = [];

    assert(cols);
    const colsArray = cols.split(',');
    assert(colsArray.length);

    if (includeRoot) {
        // Add a row for given ext key as well
        result.push(evalNextRow(rootNode, '', NETWORKS[network], colsArray));
    }

    for (let i = 0; i < count; i++) {
        const childNode = rootNode.derivePath(dPath.toString());
        result.push(evalNextRow(childNode, dPath.toString(), NETWORKS[network], colsArray));
        dPath.incrementPath();
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
};

const evalNextRow = (node: bip32.BIP32Interface, path: string, network: bitcoinjs.Network, cols: string[]): Row => {
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
};

const validateParams = (params: DeriveParams): void => {
    if (!params.network || !NETWORKS[params.network]) {
        throw new Error(`Invalid network name ${params.network}. Valid values are: ${Object.getOwnPropertyNames(NETWORKS).join(',')}.`);
    }
    if (!isValidExtKey(params.extKey, NETWORKS[params.network])) {
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
        throw new Error(`--output format valid values are 'table' or 'json'`);
    }
};
