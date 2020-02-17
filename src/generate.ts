import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import bip39 = require('bip39');
import program = require('commander');
import convertExtendedKey from './convertXpub';

const LANGS = {
    'en': 'english',
    'es': 'spanish',
    'fr': 'french',
    'it': 'italian',
    'jp': 'japanese',
    'ko': 'korean'
};

export function generateMnemonic(lang: 'en' | 'sp' | 'fr' | 'it' | 'ja' | 'ko' = 'en', printStdOut: boolean = false): string {
    const language = LANGS[lang];
    shuffle(bip39.wordlists[language]);
    const mnemonic = bip39.wordlists[language].slice(0, 24).join(' ');
    if (printStdOut) {
        console.log(mnemonic);
    }
    return mnemonic;
}

export function generateSeed(printStdOut: boolean = false): string {
    const mnemonic = generateMnemonic('en');
    const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    if (printStdOut) {
        console.log(seed);
    }
    return seed;
}

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

function generateRoot(network: bitcoinjs.networks.Network = bitcoinjs.networks.bitcoin): bip32.BIP32Interface {
    const seed = generateSeed();
    return bip32.fromSeed(Buffer.from(seed, 'hex'), network);
}

// Fisher-Yates (in-place) shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

if (require.main === module) {
    // used on command line
    program.option('-s, --seed', 'generate a random seed')
        .option('-m, --mnemonic <language>', 'generate a random mnemonic 24 words long from bip39 wordlist; language can be one of "english","spanish","french","italian","japanese","korean"')
        .option('-p, --ext-prv <keyFormat>', 'generate a random ext prv key; key format can be "xprv" | "yprv" | "Yprv" | "zprv" | "Zprv" | "tprv" | "uprv" | "Uprv" | "vprv" | "Vprv"')
        .option('-P, --ext-pub <keyFormat>', 'generate a random ext pub key; key format can be "xpub" | "ypub" | "Ypub" | "zpub" | "Zpub" | "tpub" | "upub" | "Upub" | "vpub" | "Vpub"')

    program.parse(process.argv);
    if (program.seed) {
        generateSeed(true);
    } else if (program.mnemonic) {
        generateMnemonic(program.mnemonic, true);
    } else if (program.extPrv) {
        generateExtKey(program.extPrv, true);
    } else if (program.extPub) {
        generateExtKey(program.extPub, true);
    }
}
