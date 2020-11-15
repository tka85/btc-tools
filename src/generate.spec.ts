import { generateMnemonic, generateSeed, generateExtKey, generateKeyPair } from './generate';
import bip39 = require('bip39');
import { strictEqual } from 'assert';
import { isValidExtKey, NETWORKS } from './lib/utils';

describe('generate', () => {
    describe('mnemonic', () => {
        it('should generate a 24-word mnemonic in english', () => {
            const mnemonic = generateMnemonic({});
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.english.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in spanish', () => {
            const mnemonic = generateMnemonic({ lang: 'es' });
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.spanish.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in french', () => {
            const mnemonic = generateMnemonic({ lang: 'fr' });
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.french.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in italian', () => {
            const mnemonic = generateMnemonic({ lang: 'it' });
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.italian.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in japanese', () => {
            const mnemonic = generateMnemonic({ lang: 'jp' });
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.japanese.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in korean', () => {
            const mnemonic = generateMnemonic({ lang: 'ko' });
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.korean.includes(word), true);
            }
        });
    });

    it('should generate a random seed', () => {
        const seed = generateSeed();
        strictEqual(seed.length, 128);
    });

    describe('extended keys', () => {
        it('should generate a random xprv', () => {
            const extKey = generateExtKey({ extKeyType: 'xprv' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'xprv');
        });
        it('should generate a random xpub', () => {
            const extKey = generateExtKey({ extKeyType: 'xpub' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'xpub');
        });
        it('should generate a random yprv', () => {
            const extKey = generateExtKey({ extKeyType: 'yprv' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'yprv');
        });
        it('should generate a random ypub', () => {
            const extKey = generateExtKey({ extKeyType: 'ypub' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'ypub');
        });
        it('should generate a random Yprv', () => {
            const extKey = generateExtKey({ extKeyType: 'Yprv' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'Yprv');
        });
        it('should generate a random Ypub', () => {
            const extKey = generateExtKey({ extKeyType: 'Ypub' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'Ypub');
        });
        it('should generate a random zprv', () => {
            const extKey = generateExtKey({ extKeyType: 'zprv' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'zprv');
        });
        it('should generate a random zpub', () => {
            const extKey = generateExtKey({ extKeyType: 'zpub' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'zpub');
        });
        it('should generate a random Zprv', () => {
            const extKey = generateExtKey({ extKeyType: 'Zprv' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'Zprv');
        });
        it('should generate a random Zpub', () => {
            const extKey = generateExtKey({ extKeyType: 'Zpub' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'Zpub');
        });
        it('should generate a random tprv', () => {
            const extKey = generateExtKey({ extKeyType: 'tprv' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'tprv');
        });
        it('should generate a random tpub', () => {
            const extKey = generateExtKey({ extKeyType: 'tpub' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'tpub');
        });
        it('should generate a random uprv', () => {
            const extKey = generateExtKey({ extKeyType: 'uprv' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'uprv');
        });
        it('should generate a random upub', () => {
            const extKey = generateExtKey({ extKeyType: 'upub' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'upub');
        });
        it('should generate a random Uprv', () => {
            const extKey = generateExtKey({ extKeyType: 'Uprv' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'Uprv');
        });
        it('should generate a random Upub', () => {
            const extKey = generateExtKey({ extKeyType: 'Upub' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'Upub');
        });
        it('should generate a random vprv', () => {
            const extKey = generateExtKey({ extKeyType: 'vprv' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'vprv');
        });
        it('should generate a random vpub', () => {
            const extKey = generateExtKey({ extKeyType: 'vpub' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'vpub');
        });
        it('should generate a random Vprv', () => {
            const extKey = generateExtKey({ extKeyType: 'Vprv' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'Vprv');
        });
        it('should generate a random Vpub', () => {
            const extKey = generateExtKey({ extKeyType: 'Vpub' });
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'Vpub');
        });
    });

    it('should generate a random priv/pub key pair', () => {
        const keyPair = generateKeyPair({ network: 'testnet' });
        strictEqual(keyPair.wif.startsWith('c'), true);
    });
});