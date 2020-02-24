import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import bip39 = require('bip39');
import program = require('commander');
import { convertExtendedKey } from './convertXpub';

const LANGS = {
    'en': 'english',
    'es': 'spanish',
    'fr': 'french',
    'it': 'italian',
    'jp': 'japanese',
    'ko': 'korean'
};

/**
 * @return {string} mnemonic    a random mnemonic in specified language
 */
export function generateMnemonic(lang: 'en' | 'es' | 'fr' | 'it' | 'jp' | 'ko' = 'en', printStdOut: boolean = false): string {
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
    const mnemonic = generateMnemonic('en');
    const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    if (printStdOut) {
        console.log(seed);
    }
    return seed;
}

/**
 * @return {string} extKey    a random ext key in specific format
 */
export function generateExtKey(extKeyType: 'xprv' | 'xpub' | 'yprv' | 'ypub' | 'Yprv' | 'Ypub' | 'zprv' | 'zpub' | 'Zprv' | 'Zpub' | 'tprv' | 'tpub' | 'uprv' | 'upub' | 'Uprv' | 'Upub' | 'vprv' | 'vpub' | 'Vprv' | 'Vpub' = 'xpub', printStdOut: boolean = false): string {
    const network = ['xprv', 'xpub', 'yprv', 'ypub', 'Yprv', 'Ypub', 'zprv', 'zpub', 'Zprv', 'Zpub'].includes(extKeyType) ? bitcoinjs.networks.bitcoin : bitcoinjs.networks.testnet;
    const rootNode = generateRoot(network);
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
            extKey = convertExtendedKey({ sourceKey: rootNode.toBase58(), destFormat: extKeyType });
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
            extKey = convertExtendedKey({ sourceKey: rootNode.neutered().toBase58(), destFormat: extKeyType });
            break;
        default:
            throw new Error(`Invalid extKeyType "${extKeyType}"`);
    }
    if (printStdOut) {
        console.log(extKey);
    }
    return extKey;
}

/**
 * @return {bip32.BIP32Interface} rootNode    a random bip32 HD root node
 */
function generateRoot(network: bitcoinjs.networks.Network = bitcoinjs.networks.bitcoin): bip32.BIP32Interface {
    const seed = generateSeed();
    return bip32.fromSeed(Buffer.from(seed, 'hex'), network);
}

// Fisher-Yates (in-place) shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

if (require.main === module) {
    // used on command line
    program.option('-s, --seed', 'generate a random seed')
        .option('-m, --mnemonic [language]', 'generate a random mnemonic 24 words long from bip39 wordlist; language can be one of "en","es","fr","it","jp","ko"', 'en')
        .option('-x, --ext-key <keyFormat>', 'generate a random ext prv or pub key; key format can be "xprv" | "yprv" | "Yprv" | "zprv" | "Zprv" | "tprv" | "uprv" | "Uprv" | "vprv" | "Vprv" | "xpub" | "ypub" | "Ypub" | "zpub" | "Zpub" | "tpub" | "upub" | "Upub" | "vpub" | "Vpub"');

    program.parse(process.argv);
    if (program.seed) {
        generateSeed(true);
    } else if (program.extKey) {
        generateExtKey(program.extKey, true);
    } else {
        generateMnemonic(program.mnemonic, true);
    }
}
