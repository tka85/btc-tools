import assert = require('assert');
import { convertExtendedKey } from '../convertExtKey';
import bip32 = require('bip32');
import bitcoinjs = require('bitcoinjs-lib');
import secp256k1 = require('tiny-secp256k1');
import bs58Check = require('bs58check');

export const BTC_MAINNET_XPRV_PREFIXES = ['xprv', 'yprv', 'Yprv', 'zprv', 'Zprv'];
export const BTC_MAINNET_XPUB_PREFIXES = ['xpub', 'ypub', 'Ypub', 'zpub', 'Zpub'];
export const BTC_TESTNET_XPRV_PREFIXES = ['tprv', 'uprv', 'Uprv', 'vprv', 'Vprv'];
export const BTC_TESTNET_XPUB_PREFIXES = ['tpub', 'upub', 'Upub', 'vpub', 'Vpub'];
export const ALL_BTC_MAINNET_EXT_KEY_PREFIXES = BTC_MAINNET_XPRV_PREFIXES.concat(BTC_MAINNET_XPUB_PREFIXES);
export const ALL_BTC_TESTNET_EXT_KEY_PREFIXES = BTC_TESTNET_XPRV_PREFIXES.concat(BTC_TESTNET_XPUB_PREFIXES);
export const ALL_BTC_EXT_KEY_PREFIXES = BTC_MAINNET_XPRV_PREFIXES.concat(BTC_MAINNET_XPUB_PREFIXES).concat(BTC_TESTNET_XPRV_PREFIXES).concat(BTC_TESTNET_XPUB_PREFIXES);
export const NETWORKS = {
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

/**
 * Converts an extended key into corresponding format bitcoinjs-lib can understand;
 * bitcoinjs-lib only understands xprv, xpub, tprv and tpub
 */
export function normalizeExtKey(extKey) {
    const conversions = {
        xprv: 'xprv',
        yprv: 'xprv',
        Yprv: 'xprv',
        zprv: 'xprv',
        Zprv: 'xprv',
        xpub: 'xpub',
        ypub: 'xpub',
        Ypub: 'xpub',
        zpub: 'xpub',
        Zpub: 'xpub',
        tprv: 'tprv',
        uprv: 'tprv',
        Uprv: 'tprv',
        vprv: 'tprv',
        Vprv: 'tprv',
        tpub: 'tpub',
        upub: 'tpub',
        Upub: 'tpub',
        vpub: 'tpub',
        Vpub: 'tpub',
    };
    const extKeyPrefix = extKey.slice(0, 4);
    const targetFormat = conversions[extKeyPrefix];
    assert(targetFormat, `Do not know how to convert ext key with prefix "${extKeyPrefix}"`);
    return convertExtendedKey({ extKey, targetFormat });
}

/**
 * Evaluate legacy address from HD node or ECPair or public key in hex as string or public key buffer
 */
export function getP2PKH(from: bip32.BIP32Interface | bitcoinjs.ECPairInterface | string | Buffer, network: bitcoinjs.Network = bitcoinjs.networks.bitcoin): string {
    let pubkey;
    if (typeof from === 'string' || from instanceof String) {
        pubkey = Buffer.from(from as string, 'hex');
    } else if (Buffer.isBuffer(from)) {
        // Already a pubkey buffer
        pubkey = from;
    } else {
        // HD node or ECPair
        pubkey = from.publicKey;
    }
    return bitcoinjs.payments.p2pkh({ pubkey, network }).address;
}

/**
 * Evaluate p2sh wrapped segwit address from HD node or ECPair or public key in hex as string or public key buffer
 */
export function getP2SHP2WPKH(from: bip32.BIP32Interface | bitcoinjs.ECPairInterface | string | Buffer, network: bitcoinjs.Network = bitcoinjs.networks.bitcoin): string {
    let pubkey;
    if (typeof from === 'string' || from instanceof String) {
        pubkey = Buffer.from(from as string, 'hex');
    } else if (Buffer.isBuffer(from)) {
        // Already a pubkey buffer
        pubkey = from;
    } else {
        // HD node or ECPair
        pubkey = from.publicKey;
    }
    return bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2wpkh({ pubkey, network })
    }).address;
}

/**
 * Evaluate native segwit (bech32) address from HD node or ECPair or public key in hex as string or public key buffer
 */
export function getP2WPKH(from: bip32.BIP32Interface | bitcoinjs.ECPairInterface | string | Buffer, network: bitcoinjs.Network = bitcoinjs.networks.bitcoin): string {
    let pubkey;
    if (typeof from === 'string' || from instanceof String) {
        pubkey = Buffer.from(from as string, 'hex');
    } else if (Buffer.isBuffer(from)) {
        // Already a pubkey buffer
        pubkey = from;
    } else {
        // HD node or ECPair
        pubkey = from.publicKey;
    }
    return bitcoinjs.payments.p2wpkh({ pubkey, network }).address;
}

export function isValidMainnetExtKey(extKey: string): boolean {
    let pubKeyBuff;
    extKey = normalizeExtKey(extKey);
    try {
        pubKeyBuff = bitcoinjs.bip32.fromBase58(extKey, bitcoinjs.networks.bitcoin).publicKey;
    } catch (err) {
        return false;
    }
    return isValidPublicKey(pubKeyBuff);
}

export function isValidTestnetExtKey(extKey: string): boolean {
    let pubKeyBuff;
    extKey = normalizeExtKey(extKey);
    try {
        pubKeyBuff = bitcoinjs.bip32.fromBase58(extKey, bitcoinjs.networks.testnet).publicKey;
    } catch (err) {
        return false;
    }
    return isValidPublicKey(pubKeyBuff);
}

export function isValidExtKey(extKey: string, network?: bitcoinjs.Network): boolean {
    extKey = normalizeExtKey(extKey);
    if (network) {
        return isValidPublicKey(bitcoinjs.bip32.fromBase58(extKey, network).publicKey) || isValidPrivateKey(bitcoinjs.bip32.fromBase58(extKey, network).privateKey);
    }
    try {
        return isValidPublicKey(bitcoinjs.bip32.fromBase58(extKey, bitcoinjs.networks.bitcoin).publicKey);
    } /* tslint:disable:no-empty */
    catch (err) { }
    try {
        return isValidPublicKey(bitcoinjs.bip32.fromBase58(extKey, bitcoinjs.networks.testnet).publicKey);
    } /* tslint:disable:no-empty */
    catch (err) { }
    try {
        return isValidPrivateKey(bitcoinjs.bip32.fromBase58(extKey, bitcoinjs.networks.bitcoin).privateKey);
    } /* tslint:disable:no-empty */
    catch (err) { }
    try {
        return isValidPrivateKey(bitcoinjs.bip32.fromBase58(extKey, bitcoinjs.networks.testnet).privateKey);
    } /* tslint:disable:no-empty */
    catch (err) { }
    return false;
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

export function WIF2privKey(wif: string): Buffer {
    // First decode WIF; decoded form is without checksum
    let keyBuffer = bs58Check.decode(wif);
    // Drop version byte (0xEF for testnet, 0x80 for mainnet)
    keyBuffer = keyBuffer.subarray(1, keyBuffer.length);
    // If still not 32 bytes, means it has compression byte; drop it too
    if (keyBuffer.length !== 32) {
        keyBuffer = keyBuffer.subarray(0, keyBuffer.length - 1);
        if (keyBuffer.length !== 32) {
            throw new Error('Invalid private key length');
        }
    }
    return keyBuffer;
}
