import assert = require('assert');
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import bip39 = require('bip39');
import program = require('commander');
import { convertExtendedKey } from './convertXpub';
import { shuffle, ALL_BTC_MAINNET_EXT_KEY_PREFIXES, fetchNetwork } from './lib/utils';

const LANGS = {
    'en': 'english',
    'es': 'spanish',
    'fr': 'french',
    'it': 'italian',
    'jp': 'japanese',
    'ko': 'korean'
};

type KeyPair = {
    wif: string,
    privKey: string
    publicKey: string
}

/**
 * @return {string} mnemonic    a random mnemonic in specified language
 */
export function generateMnemonic({ lang = 'en', printStdOut = false }: { lang?: 'en' | 'es' | 'fr' | 'it' | 'jp' | 'ko', printStdOut?: boolean }): string {
    const language = LANGS[lang];
    shuffle(bip39.wordlists[language]);
    const mnemonic = bip39.wordlists[language].slice(0, 24).join(' ');
    if (printStdOut) {
        console.log(mnemonic);
    }
    return mnemonic;
}

/**
 * @return {string} seed    a random seed in hex
 */
export function generateSeed(printStdOut: boolean = false): string {
    const mnemonic = generateMnemonic({ lang: 'en' });
    const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    if (printStdOut) {
        console.log(seed);
    }
    return seed;
}

/**
 * @return {string} extKey    a random ext key in specific format
 */
export function generateExtKey({ extKeyType, printStdOut = false }: { extKeyType: 'xprv' | 'xpub' | 'yprv' | 'ypub' | 'Yprv' | 'Ypub' | 'zprv' | 'zpub' | 'Zprv' | 'Zpub' | 'tprv' | 'tpub' | 'uprv' | 'upub' | 'Uprv' | 'Upub' | 'vprv' | 'vpub' | 'Vprv' | 'Vpub', printStdOut?: boolean }): string {
    const network = ALL_BTC_MAINNET_EXT_KEY_PREFIXES.includes(extKeyType) ? bitcoinjs.networks.bitcoin : bitcoinjs.networks.testnet;
    const rootNode = generateBIP32Root(network);
    let extKey;
    switch (extKeyType) {
        case 'xprv':
        case 'tprv':
            extKey = rootNode.toBase58();
            break;
        case 'yprv':
        case 'Yprv':
        case 'zprv':
        case 'Zprv':
        case 'uprv':
        case 'Uprv':
        case 'vprv':
        case 'Vprv':
            extKey = convertExtendedKey({ extKey: rootNode.toBase58(), toFormat: extKeyType });
            break;
        case 'xpub':
        case 'tpub':
            extKey = rootNode.neutered().toBase58();
            break;
        case 'ypub':
        case 'Ypub':
        case 'zpub':
        case 'Zpub':
        case 'upub':
        case 'Upub':
        case 'vpub':
        case 'Vpub':
            extKey = convertExtendedKey({ extKey: rootNode.neutered().toBase58(), toFormat: extKeyType });
            break;
        default:
            throw new Error(`Invalid extKeyType "${extKeyType}"`);
    }
    if (printStdOut) {
        console.log(extKey);
    }
    return extKey;
}

export function generateKeyPair({ network, printStdOut = false }: { network: string, printStdOut?: boolean }): KeyPair {
    assert(['mainnet', 'testnet'].includes(network), `Invalid network "${network}"; only recognize "mainnet" or "testnet`);
    const bjsNetwork: bitcoinjs.Network = network === 'mainnet' ? bitcoinjs.networks.bitcoin : bitcoinjs.networks.testnet;
    const pair = bitcoinjs.ECPair.makeRandom({ network: bjsNetwork, compressed: true });
    const res: KeyPair = { wif: pair.toWIF(), privKey: pair.privateKey.toString('hex'), publicKey: pair.publicKey.toString('hex') };
    if (printStdOut) {
        console.table(res);
    }
    return res;
}

/**
 * @return {bip32.BIP32Interface} rootNode    a random bip32 HD root node
 */
function generateBIP32Root(network: bitcoinjs.networks.Network = bitcoinjs.networks.bitcoin): bip32.BIP32Interface {
    const seed = generateSeed();
    return bip32.fromSeed(Buffer.from(seed, 'hex'), network);
}

if (require.main === module) {
    // used on command line
    program.option('-s, --seed', 'generate a random seed')
        .option('-m, --mnemonic [language]', 'generate a random mnemonic 24 words long from bip39 wordlist; language can be one of "en","es","fr","it","jp","ko"', 'en')
        .option('-p, --key-pair <mainnet|testnet>', 'generate a random key pair (private and public key) for given network "mainnet" or "testnet"')
        .option('-x, --ext-key <keyFormat>', 'generate a random ext prv or pub key; key format can be "xprv" | "yprv" | "Yprv" | "zprv" | "Zprv" | "tprv" | "uprv" | "Uprv" | "vprv" | "Vprv" | "xpub" | "ypub" | "Ypub" | "zpub" | "Zpub" | "tpub" | "upub" | "Upub" | "vpub" | "Vpub"');

    program.parse(process.argv);
    if (program.seed) {
        generateSeed(true);
    } else if (program.extKey) {
        generateExtKey({ extKeyType: program.extKey, printStdOut: true });
    } else if (program.keyPair) {
        generateKeyPair({ network: program.keyPair, printStdOut: true });
    } else if (program.mnemonic) {
        generateMnemonic({ lang: program.mnemonic, printStdOut: true });
    } else {
        throw new Error(`Invalid params ${process.argv.slice(2)}`);
    }
}
