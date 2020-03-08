import { getP2PKH, getP2SHP2WPKH, getP2WPKH } from './utils';
import { equal } from 'assert';
import bitcoinjs = require('bitcoinjs-lib');

const network = bitcoinjs.networks.testnet;

describe('utils', () => {
    describe('getP2PKH()', () => {
        const address = 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud';
        it('should return address if given bip32 hd node', () => {
            const hdNode = bitcoinjs.bip32.fromBase58('tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK', network);
            equal(address, getP2PKH(hdNode, network));
        });
        it('should return address if given ECPair', () => {
            const keyPair = bitcoinjs.ECPair.fromWIF('cQfoY67cetFNunmBUX5wJiw3VNoYx3gG9U9CAofKE6BfiV1fSRw7', network);
            equal(address, getP2PKH(keyPair, network));
        });
        it('should return address if given public key as string', () => {
            const pubKey = '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59';
            equal(address, getP2PKH(pubKey, network));
        });
        it('should return address if given public key buffer', () => {
            const pubKeyBuff = Buffer.from('023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59', 'hex');
            equal(address, getP2PKH(pubKeyBuff, network));
        });
    });

    describe('getP2SHP2WPKH()', () => {
        const address = '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY';
        it('should return address if given bip32 hd node', () => {
            const hdNode = bitcoinjs.bip32.fromBase58('tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK', network);
            equal(address, getP2SHP2WPKH(hdNode, network));
        });
        it('should return address if given ECPair', () => {
            const keyPair = bitcoinjs.ECPair.fromWIF('cQfoY67cetFNunmBUX5wJiw3VNoYx3gG9U9CAofKE6BfiV1fSRw7', network);
            equal(address, getP2SHP2WPKH(keyPair, network));
        });
        it('should return address if given public key as string', () => {
            const pubKey = '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59';
            equal(address, getP2SHP2WPKH(pubKey, network));
        });
        it('should return address if given public key buffer', () => {
            const pubKeyBuff = Buffer.from('023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59', 'hex');
            equal(address, getP2SHP2WPKH(pubKeyBuff, network));
        });
    });

    describe('getP2WPKH()', () => {
        const address = 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4';
        it('should return address if given bip32 hd node', () => {
            const hdNode = bitcoinjs.bip32.fromBase58('tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK', network);
            equal(address, getP2WPKH(hdNode, network));
        });
        it('should return address if given ECPair', () => {
            const keyPair = bitcoinjs.ECPair.fromWIF('cQfoY67cetFNunmBUX5wJiw3VNoYx3gG9U9CAofKE6BfiV1fSRw7', network);
            equal(address, getP2WPKH(keyPair, network));
        });
        it('should return address if given public key as string', () => {
            const pubKey = '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59';
            equal(address, getP2WPKH(pubKey, network));
        });
        it('should return address if given public key buffer', () => {
            const pubKeyBuff = Buffer.from('023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59', 'hex');
            equal(address, getP2WPKH(pubKeyBuff, network));
        });
    });
});