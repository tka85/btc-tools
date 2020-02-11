import assert = require('assert');
import program = require('commander');
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');

type Row = {
    path?: string,
    legacy?: string,
    p2sh_segwit?: string,
    bech32?: string,
    xprv?: string,
    xpub?: string,
    privkey?: string,
    pubkey?: string
};

program.requiredOption('-k, --key <base58key>', 'xprv, xpub, tprv, tpub, ...')
    .option('-n, --network <network>', '"mainnet" or "testnet"', bitcoinjs.networks.bitcoin)
    .requiredOption('-p, --path <derivation-path>', 'can be "" or "m" or "<number>" or "<number>/<number>/..."; for paths with hardened components, priv key is necessary')
    .requiredOption('-C, --cols <columns-to-include>', 'comma separated list of: "path", "legacy", "p2sh_segwit", "bech32", "xprv", "xpub", "privkey", "pubkey"  (default: "path,legacy,p2sh_segwit")', 'path,legacy,p2sh_segwit')
    .option('-R, --include-root', 'whether to include the root as well (default: false)', false)
    .option('-c, --count <number>', 'number of addresses to derive', 5);

program.parse(process.argv);

program.network = (program.network === 'mainnet' || program.network === undefined) ? bitcoinjs.networks.bitcoin : bitcoinjs.networks.testnet;
console.log(`>>> `, program.network);

const res: Row[] = [];

const rootNode = bip32.fromBase58(program.key, program.network);

assert(program.cols);
program.cols = program.cols.split(',');
assert(program.cols.length);

if (program.includeRoot) {
    res.push(evalNextRow(rootNode, ''));
}

for (let i = 0; i < program.count; i++) {
    const normalizedPath = normalizeBasePath(program.path);
    const derivationPath = normalizedPath ? `${normalizedPath}/${i}` : `${i}`;
    const childNode = rootNode.derivePath(derivationPath);
    res.push(evalNextRow(childNode, derivationPath));
}

console.table(res);

/**
 * Reduces user provided path to a form usable for derivation
 * "" => ""
 * "m" => ""
 * "m/" => ""
 * "m/0" => "0"
 * "/0" => "0"
 * "0" => "0"
 * "/1/2/3" => "1/2/3"
 * "1/2/3" => "1/2/3"
 * @param path
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

function evalNextRow(node: any, derivationPath: string): Row {
    const nextRow: Row = {};
    for (const c of program.cols) {
        switch (c) {
            case 'path':
                nextRow.path = `m/${derivationPath}`;
                break;
            case 'legacy':
                nextRow.legacy = getP2PKH(node, program.network);
                break;
            case 'p2sh_segwit':
                nextRow.p2sh_segwit = getP2SHP2WPKH(node, program.network);
                break;
            case 'bech32':
                nextRow.bech32 = getP2WPKH(node, program.network);
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
            default:
                throw new Error('Invalid column name:' + JSON.stringify(c));
        }
    }
    return nextRow;
}
