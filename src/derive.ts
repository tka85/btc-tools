import assert = require('assert');
import program = require('commander');
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import convertExtendedKey from './xpubConvert';

type Row = {
    path?: string,
    legacy?: string,
    p2sh_segwit?: string,
    bech32?: string,
    xprv?: string,
    xpub?: string,
    privkey?: string,
    depth?: string,
    pubkey?: string
};

function derive({ key, network, path, cols = 'path,depth,legacy,p2sh_segwit,bech32', includeRoot = false, count = 5, printStdout = false }: { key: string, network: string, path: string, cols?: string, includeRoot?: boolean, count?: number, printStdout?: boolean }) {
    assert(key, 'missing extended key');
    assert(network, 'missing network');
    assert(path || path === '', 'missing or invalid path');
    let coinNetwork: bitcoinjs.Network;

    key = normalizeExtKey(key);

    switch (network) {
        case 'mainnet':
            coinNetwork = bitcoinjs.networks.bitcoin;
            break;
        case 'testnet':
            coinNetwork = bitcoinjs.networks.testnet;
            break;
        default:
            throw new Error(`Invalid network specified: ${network}; expected "mainnet" or "testnet"`);
    }

    const res: Row[] = [];

    const rootNode = bip32.fromBase58(key, coinNetwork);

    assert(cols);
    let colsArray = cols.split(',');
    assert(colsArray.length);

    if (includeRoot) {
        res.push(evalNextRow(rootNode, '', coinNetwork, colsArray));
    }

    for (let i = 0; i < count; i++) {
        const normalizedPath = normalizeBasePath(path);
        const derivationPath = normalizedPath ? `${normalizedPath}/${i}` : `${i}`;
        const childNode = rootNode.derivePath(derivationPath);
        res.push(evalNextRow(childNode, derivationPath, coinNetwork, colsArray));
    }

    if (printStdout) {
        console.table(res);
    }
    return res;
}

// Converts an extended key into something bitcoinjs-lib can understand; bitcoinjs-lib only understands xprv, xpub, tprv and tpub
function normalizeExtKey(extKey) {
    const conversions = {
        xprv: 'xprv',
        yprv: 'xprv',
        Yprv: 'xprv',
        zprv: 'xprv',
        Zprv: 'xprv',
        xpub: 'xpub',
        ypub: 'xpub',
        Ypub: 'xpub',
        zpub: 'xpub',
        Zpub: 'xpub',
        tprv: 'tprv',
        uprv: 'tprv',
        Uprv: 'tprv',
        vprv: 'tprv',
        Vprv: 'tprv',
        tpub: 'tpub',
        upub: 'tpub',
        Upub: 'tpub',
        vpub: 'tpub',
        Vpub: 'tpub',
    };
    const extKeyPrefix = extKey.slice(0, 4);
    const destFormat = conversions[extKeyPrefix];
    assert(destFormat, `Do not know how to convert ext key with prefix "${extKeyPrefix}"`);
    return convertExtendedKey({ sourceKey: extKey, destFormat });
}
/**
 * Reduces user provided path to a form usable for derivation by bitcoinjs-lib
 * "" => ""
 * "m" => ""
 * "m/" => ""
 * "m/0" => "0"
 * "/0" => "0"
 * "0" => "0"
 * "/1/2/3" => "1/2/3"
 * "1/2/3" => "1/2/3"
 * "1/2/3/" => "1/2/3"
 * "/1/2/3/" => "1/2/3"
 */
function normalizeBasePath(path: string): string {
    // Strip any leading '/'
    path = path.replace(/[/]$/, '');
    return path.replace(/^m?[/]?/, '');
}

// Evaluate legacy address
function getP2PKH(node: any, network?: any): string {
    return bitcoinjs.payments.p2pkh({ pubkey: node.publicKey, network }).address;
}

// Evaluate p2sh wrapped segwit address
function getP2SHP2WPKH(node: any, network?: any): string {
    return bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2wpkh({ pubkey: node.publicKey, network })
    }).address;
}

// Evaluate native segwit (bech32) address
function getP2WPKH(node: any, network?: any): string {
    return bitcoinjs.payments.p2wpkh({ pubkey: node.publicKey, network }).address;
}

function evalNextRow(node: any, derivationPath: string, network: bitcoinjs.Network, cols: string[]): Row {
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
                nextRow.p2sh_segwit = getP2SHP2WPKH(node, network);
                break;
            case 'bech32':
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

if (require.main === module) {
    // used on CLI
    program.requiredOption('-k, --key <base58key>', 'xprv, xpub, tprv, tpub, ...')
        .requiredOption('-n, --network <network>', '"mainnet" or "testnet"')
        .requiredOption('-p, --path <derivation-path>', 'can be "" or "m" or "<number>" or "<number>/<number>/..."; for paths with hardened components, priv key is necessary')
        .option('-C, --cols <columns-in-result>', 'comma separated list of: "path", "legacy", "p2sh_segwit", "bech32", "xprv", "xpub", "privkey", "pubkey", "depth"', 'path,depth,legacy,p2sh_segwit,bech32')
        .option('-R, --include-root', 'whether to include the root as well', false)
        .option('-c, --count <number>', 'number of addresses to derive', 5);
    program.parse(process.argv);
    derive({ key: program.key, network: program.network, path: program.path, cols: program.cols, includeRoot: program.includeRoot, count: program.count, printStdout: true });
}

// used as a module
export default derive;