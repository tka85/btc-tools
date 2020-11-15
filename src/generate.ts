import assert = require('assert');
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import bip39 = require('bip39');
import shuffle = require('crypto-shuffle');
import { convert, ALL_BTC_MAINNET_EXT_KEY_PREFIXES } from './convert';
import { NETWORKS } from './lib/utils';

const LANGS = {
    'en': 'english',
    'es': 'spanish',
    'fr': 'french',
    'it': 'italian',
    'jp': 'japanese',
    'ko': 'korean'
};

export type KeyPair = {
    privKey: string
    pubKey: string
}

type GenerateParams = {
    seed?: boolean,
    extKeyType?: 'xprv' | 'xpub' | 'yprv' | 'ypub' | 'Yprv' | 'Ypub' | 'zprv' | 'zpub' | 'Zprv' | 'Zpub' | 'tprv' | 'tpub' | 'uprv' | 'upub' | 'Uprv' | 'Upub' | 'vprv' | 'vpub' | 'Vprv' | 'Vpub',
    keyPair?: boolean,
    mnemonicLang?: 'en' | 'es' | 'fr' | 'it' | 'jp' | 'ko',
    output?: boolean
}

/**
 * @return {bip32.BIP32Interface} rootNode    a random bip32 HD root node
 */
function generateBIP32Root(network: bitcoinjs.Network): bip32.BIP32Interface {
    const seed = generateSeed({ output: false });
    return bip32.fromSeed(Buffer.from(seed, 'hex'), network);
}

/**
 * @return {string} mnemonic    a random mnemonic in specified language
 */
function generateMnemonic({ mnemonicLang, output = false }: GenerateParams): string {
    const language = LANGS[mnemonicLang];
    shuffle(bip39.wordlists[language]);
    const mnemonic = bip39.wordlists[language].slice(0, 24).join(' ');
    if (output) {
        console.log(mnemonic);
        return;
    }
    return mnemonic;
}

/**
 * @return {string} seed    a random seed in hex
 */
function generateSeed({ output = false }: GenerateParams): string {
    const mnemonic = generateMnemonic({ mnemonicLang: 'en' });
    const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    if (output) {
        console.log(seed);
        return;
    }
    return seed;
}

/**
 * @return {string} extKey    a random ext key in specified format
 */
function generateExtKey({ extKeyType, output = false }: GenerateParams): string {
    const network = ALL_BTC_MAINNET_EXT_KEY_PREFIXES.includes(extKeyType) ? NETWORKS.btc : NETWORKS.btctest;
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
            extKey = convert({ extKey: rootNode.toBase58(), targetFormat: extKeyType });
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
            extKey = convert({ extKey: rootNode.neutered().toBase58(), targetFormat: extKeyType });
            break;
        default:
            throw new Error(`Invalid extKeyType "${extKeyType}"`);
    }
    if (output) {
        console.log(extKey);
        return;
    }
    return extKey;
}

function generateKeyPair({ output = false }: GenerateParams): KeyPair {
    const pair = bitcoinjs.ECPair.makeRandom({ network: bitcoinjs.networks.bitcoin, compressed: true });
    const keyPair: KeyPair = { privKey: pair.privateKey.toString('hex'), pubKey: pair.publicKey.toString('hex') };
    if (output) {
        console.table(keyPair);
        return;
    }
    return keyPair;
}

function validateParams(params: GenerateParams): void {
    // TODO: implement
    return;
}

export function generate({ seed, extKeyType, keyPair, mnemonicLang, output }: GenerateParams): string | KeyPair {
    validateParams({ seed, extKeyType, keyPair, mnemonicLang });
    if (seed) {
        return generateSeed({ output });
    } else if (extKeyType) {
        return generateExtKey({ extKeyType, output });
    } else if (keyPair) {
        return generateKeyPair({ output });
    } else if (mnemonicLang) {
        return generateMnemonic({ mnemonicLang, output });
    }
}