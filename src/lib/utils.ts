import assert = require('assert');
import { normalizeExtKey } from '../convert';
import bitcoinjs = require('bitcoinjs-lib');
import secp256k1 = require('tiny-secp256k1');

export const NETWORKS: { [key: string]: bitcoinjs.Network } = {
    btc: bitcoinjs.networks.bitcoin,
    btctest: bitcoinjs.networks.testnet,
    ltc: {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bech32: 'ltc',
        bip32: { public: 76067358, private: 76066276 },
        pubKeyHash: 48,
        scriptHash: 50,
        wif: 176
    },
    ltctest: {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bech32: 'tltc',
        bip32: { public: 70617039, private: 70615956 },
        pubKeyHash: 111,
        scriptHash: 58,
        wif: 239
    }
};

export function isValidExtKey(extKey: string, network: bitcoinjs.Network): boolean {
    const node = bitcoinjs.bip32.fromBase58(normalizeExtKey(extKey), network);
    return isValidPublicKey(node.publicKey) || isValidPrivateKey(node.privateKey);
}

export function isValidPublicKey(pubKey: string | Buffer): boolean {
    if (typeof pubKey === 'string' || pubKey instanceof String) {
        pubKey = Buffer.from(pubKey as string, 'hex');
    }
    return secp256k1.isPoint(pubKey);
}

export function isValidPrivateKey(privKey: string | Buffer): boolean {
    if (typeof privKey === 'string' || privKey instanceof String) {
        privKey = Buffer.from(privKey as string, 'hex');
    }
    return secp256k1.isPrivate(privKey);
}
