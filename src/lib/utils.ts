import assert = require('assert');
import { convertExtendedKey } from '../convertXpub';
import bip32 = require('bip32');
import bitcoinjs = require('bitcoinjs-lib');
import secp256k1 = require('tiny-secp256k1');

export const BTC_MAINNET_XPRV_PREFIXES = ['xprv', 'yprv', 'Yprv', 'zprv', 'Zprv'];
export const BTC_MAINNET_XPUB_PREFIXES = ['xpub', 'ypub', 'Ypub', 'zpub', 'Zpub'];
export const BTC_TESTNET_XPRV_PREFIXES = ['tprv', 'uprv', 'Uprv', 'vprv', 'Vprv'];
export const BTC_TESTNET_XPUB_PREFIXES = ['tpub', 'upub', 'Upub', 'vpub', 'Vpub'];
export const ALL_EXT_KEY_PREFIXES = BTC_MAINNET_XPRV_PREFIXES.concat(BTC_MAINNET_XPUB_PREFIXES).concat(BTC_TESTNET_XPRV_PREFIXES).concat(BTC_TESTNET_XPUB_PREFIXES);

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
    const destFormat = conversions[extKeyPrefix];
    assert(destFormat, `Do not know how to convert ext key with prefix "${extKeyPrefix}"`);
    return convertExtendedKey({ sourceKey: extKey, destFormat });
}

/**
 * Evaluate legacy address from HD node
 */
export function getP2PKH(from: bip32.BIP32Interface | bitcoinjs.ECPairInterface, network: bitcoinjs.Network = bitcoinjs.networks.bitcoin): string {
    return bitcoinjs.payments.p2pkh({ pubkey: from.publicKey, network }).address;
}

/**
 * Evaluate p2sh wrapped segwit address from HD node
 */
export function getP2SHP2WPKH(from: bip32.BIP32Interface | bitcoinjs.ECPairInterface, network: bitcoinjs.Network = bitcoinjs.networks.bitcoin): string {
    return bitcoinjs.payments.p2sh({
        redeem: bitcoinjs.payments.p2wpkh({ pubkey: from.publicKey, network })
    }).address;
}

/**
 * Evaluate native segwit (bech32) address from HD node
 */
export function getP2WPKH(from: bip32.BIP32Interface | bitcoinjs.ECPairInterface, network: bitcoinjs.Network = bitcoinjs.networks.bitcoin): string {
    return bitcoinjs.payments.p2wpkh({ pubkey: from.publicKey, network }).address;
}

/**
 * Get the bitcoinjs network object for given param 'mainnet' or 'testnet'
 */
export function fetchNetwork(network: string): bitcoinjs.Network {
    switch (network) {
        case 'mainnet':
            return bitcoinjs.networks.bitcoin;
            break;
        case 'testnet':
            return bitcoinjs.networks.testnet;
            break;
        default:
            throw new Error(`Invalid network specified: "${network}"; expected "mainnet" or "testnet"`);
    }
}

export function isValidMainnetExtKey(extKey: string): boolean {
    let pubKeyBuff;
    try {
        pubKeyBuff = bitcoinjs.bip32.fromBase58(extKey, bitcoinjs.networks.bitcoin).publicKey;
    } catch (err) {
        return false;
    }
    return isValidPublicKey(pubKeyBuff.toString('hex'));
}

export function isValidTestnetExtKey(extKey: string): boolean {
    let pubKeyBuff;
    try {
        pubKeyBuff = bitcoinjs.bip32.fromBase58(extKey, bitcoinjs.networks.testnet).publicKey;
    } catch (err) {
        return false;
    }
    return isValidPublicKey(pubKeyBuff.toString('hex'));
}

export function isValidExtKey(extKey: string, network?: bitcoinjs.Network): boolean {
    if (network) {
        return isValidPublicKey(bitcoinjs.bip32.fromBase58(extKey, network).publicKey.toString('hex'));
    }
    return isValidPublicKey(bitcoinjs.bip32.fromBase58(extKey, bitcoinjs.networks.bitcoin).publicKey.toString('hex')) || isValidPublicKey(bitcoinjs.bip32.fromBase58(extKey, bitcoinjs.networks.testnet).publicKey.toString('hex'));
}

export function isValidPublicKey(pubKey: string | Buffer): boolean {
    if (typeof pubKey === 'string' || pubKey instanceof String) {
        pubKey = Buffer.from(pubKey as string, 'hex');
    }
    return secp256k1.isPoint(pubKey);
}
