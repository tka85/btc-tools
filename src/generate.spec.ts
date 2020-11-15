import { generate, KeyPair } from './generate';
import bip39 = require('bip39');
import { strictEqual } from 'assert';
import { isValidExtKey, isValidPrivateKey, isValidPublicKey, NETWORKS } from './lib/utils';

describe('generate', () => {
    describe('mnemonic', () => {
        it('should generate a 24-word mnemonic in english', () => {
            const mnemonic = generate({ mnemonicLang: 'en' }) as string;
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.english.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in spanish', () => {
            const mnemonic = generate({ mnemonicLang: 'es' }) as string;
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.spanish.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in french', () => {
            const mnemonic = generate({ mnemonicLang: 'fr' }) as string;
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.french.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in italian', () => {
            const mnemonic = generate({ mnemonicLang: 'it' }) as string;
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.italian.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in japanese', () => {
            const mnemonic = generate({ mnemonicLang: 'jp' }) as string;
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.japanese.includes(word), true);
            }
        });
        it('should generate a 24-word mnemonic in korean', () => {
            const mnemonic = generate({ mnemonicLang: 'ko' }) as string;
            for (const word of mnemonic.split(' ')) {
                strictEqual(bip39.wordlists.korean.includes(word), true);
            }
        });
    });

    it('should generate a random seed', () => {
        const seed = generate({ seed: true }) as string;
        strictEqual(seed.length, 128);
    });

    describe('extended keys', () => {
        it('should generate a random xprv', () => {
            const extKey = generate({ extKeyType: 'xprv' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'xprv');
        });
        it('should generate a random xpub', () => {
            const extKey = generate({ extKeyType: 'xpub' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'xpub');
        });
        it('should generate a random yprv', () => {
            const extKey = generate({ extKeyType: 'yprv' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'yprv');
        });
        it('should generate a random ypub', () => {
            const extKey = generate({ extKeyType: 'ypub' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'ypub');
        });
        it('should generate a random Yprv', () => {
            const extKey = generate({ extKeyType: 'Yprv' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'Yprv');
        });
        it('should generate a random Ypub', () => {
            const extKey = generate({ extKeyType: 'Ypub' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'Ypub');
        });
        it('should generate a random zprv', () => {
            const extKey = generate({ extKeyType: 'zprv' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'zprv');
        });
        it('should generate a random zpub', () => {
            const extKey = generate({ extKeyType: 'zpub' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'zpub');
        });
        it('should generate a random Zprv', () => {
            const extKey = generate({ extKeyType: 'Zprv' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'Zprv');
        });
        it('should generate a random Zpub', () => {
            const extKey = generate({ extKeyType: 'Zpub' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btc), true);
            strictEqual(extKey.slice(0, 4), 'Zpub');
        });
        it('should generate a random tprv', () => {
            const extKey = generate({ extKeyType: 'tprv' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'tprv');
        });
        it('should generate a random tpub', () => {
            const extKey = generate({ extKeyType: 'tpub' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'tpub');
        });
        it('should generate a random uprv', () => {
            const extKey = generate({ extKeyType: 'uprv' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'uprv');
        });
        it('should generate a random upub', () => {
            const extKey = generate({ extKeyType: 'upub' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'upub');
        });
        it('should generate a random Uprv', () => {
            const extKey = generate({ extKeyType: 'Uprv' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'Uprv');
        });
        it('should generate a random Upub', () => {
            const extKey = generate({ extKeyType: 'Upub' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'Upub');
        });
        it('should generate a random vprv', () => {
            const extKey = generate({ extKeyType: 'vprv' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'vprv');
        });
        it('should generate a random vpub', () => {
            const extKey = generate({ extKeyType: 'vpub' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'vpub');
        });
        it('should generate a random Vprv', () => {
            const extKey = generate({ extKeyType: 'Vprv' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'Vprv');
        });
        it('should generate a random Vpub', () => {
            const extKey = generate({ extKeyType: 'Vpub' }) as string;
            strictEqual(isValidExtKey(extKey, NETWORKS.btctest), true);
            strictEqual(extKey.slice(0, 4), 'Vpub');
        });
    });

    it('should generate a random priv/pub key pair', () => {
        const keyPair = generate({ keyPair: true }) as KeyPair;
        strictEqual(isValidPublicKey(keyPair.pubKey), true);
        strictEqual(isValidPrivateKey(keyPair.privKey), true);
    });
});