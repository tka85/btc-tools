import { generateMnemonic, generateSeed, generateExtKey } from './generate';
import bip39 = require('bip39');
import { equal } from 'assert';

describe('generate', () => {
    describe('mnemonic', () => {
        it('should generate a 24-word mnemonic in english', () => {
            const mnemonic = generateMnemonic();
            for (const word of mnemonic.split(' ')) {
                equal(bip39.wordlists.english.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in spanish', () => {
            const mnemonic = generateMnemonic('es');
            for (const word of mnemonic.split(' ')) {
                equal(bip39.wordlists.spanish.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in french', () => {
            const mnemonic = generateMnemonic('fr');
            for (const word of mnemonic.split(' ')) {
                equal(bip39.wordlists.french.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in italian', () => {
            const mnemonic = generateMnemonic('it');
            for (const word of mnemonic.split(' ')) {
                equal(bip39.wordlists.italian.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in japanese', () => {
            const mnemonic = generateMnemonic('jp');
            for (const word of mnemonic.split(' ')) {
                equal(bip39.wordlists.japanese.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in korean', () => {
            const mnemonic = generateMnemonic('ko');
            for (const word of mnemonic.split(' ')) {
                equal(bip39.wordlists.korean.includes(word), true);
            }
        });
    });
    it('should generate a random seed', () => {
        const seed = generateSeed();
        equal(seed.length, 128);
    });
    describe('extended keys', () => {

        it('should generate a random xprv', () => {
            const extKey = generateExtKey('xprv');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'xprv');
        });
        it('should generate a random xpub', () => {
            const extKey = generateExtKey('xpub');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'xpub');
        });
        it('should generate a random yprv', () => {
            const extKey = generateExtKey('yprv');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'yprv');
        });
        it('should generate a random ypub', () => {
            const extKey = generateExtKey('ypub');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'ypub');
        });
        it('should generate a random Yprv', () => {
            const extKey = generateExtKey('Yprv');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'Yprv');
        });
        it('should generate a random Ypub', () => {
            const extKey = generateExtKey('Ypub');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'Ypub');
        });
        it('should generate a random zprv', () => {
            const extKey = generateExtKey('zprv');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'zprv');
        });
        it('should generate a random zpub', () => {
            const extKey = generateExtKey('zpub');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'zpub');
        });
        it('should generate a random Zprv', () => {
            const extKey = generateExtKey('Zprv');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'Zprv');
        });
        it('should generate a random Zpub', () => {
            const extKey = generateExtKey('Zpub');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'Zpub');
        });
        it('should generate a random tprv', () => {
            const extKey = generateExtKey('tprv');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'tprv');
        });
        it('should generate a random tpub', () => {
            const extKey = generateExtKey('tpub');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'tpub');
        });
        it('should generate a random uprv', () => {
            const extKey = generateExtKey('uprv');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'uprv');
        });
        it('should generate a random upub', () => {
            const extKey = generateExtKey('upub');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'upub');
        });
        it('should generate a random Uprv', () => {
            const extKey = generateExtKey('Uprv');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'Uprv');
        });
        it('should generate a random Upub', () => {
            const extKey = generateExtKey('Upub');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'Upub');
        });
        it('should generate a random vprv', () => {
            const extKey = generateExtKey('vprv');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'vprv');
        });
        it('should generate a random vpub', () => {
            const extKey = generateExtKey('vpub');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'vpub');
        });
        it('should generate a random Vprv', () => {
            const extKey = generateExtKey('Vprv');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'Vprv');
        });
        it('should generate a random Vpub', () => {
            const extKey = generateExtKey('Vpub');
            equal(extKey.length, 111);
            equal(extKey.slice(0, 4), 'Vpub');
        });
    });
});