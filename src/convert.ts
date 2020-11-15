import bs58Check = require('bs58check');
import assert = require('assert');

export const BTC_MAINNET_XPRV_PREFIXES = ['xprv', 'yprv', 'Yprv', 'zprv', 'Zprv'];
export const BTC_MAINNET_XPUB_PREFIXES = ['xpub', 'ypub', 'Ypub', 'zpub', 'Zpub'];
export const BTC_TESTNET_XPRV_PREFIXES = ['tprv', 'uprv', 'Uprv', 'vprv', 'Vprv'];
export const BTC_TESTNET_XPUB_PREFIXES = ['tpub', 'upub', 'Upub', 'vpub', 'Vpub'];
export const ALL_BTC_MAINNET_EXT_KEY_PREFIXES = BTC_MAINNET_XPRV_PREFIXES.concat(BTC_MAINNET_XPUB_PREFIXES);
export const ALL_BTC_TESTNET_EXT_KEY_PREFIXES = BTC_TESTNET_XPRV_PREFIXES.concat(BTC_TESTNET_XPUB_PREFIXES);
export const ALL_BTC_EXT_KEY_PREFIXES = BTC_MAINNET_XPRV_PREFIXES.concat(BTC_MAINNET_XPUB_PREFIXES).concat(BTC_TESTNET_XPRV_PREFIXES).concat(BTC_TESTNET_XPUB_PREFIXES);

const EXT_KEY_DATA = {
    // mainnet P2PKH or P2SH
    xprv: { version: '0488ade4', normalized: 'xprv', validTargets: BTC_MAINNET_XPRV_PREFIXES },
    xpub: { version: '0488b21e', normalized: 'xpub', validTargets: BTC_MAINNET_XPUB_PREFIXES },
    // mainnet P2WPKH in P2SH
    yprv: { version: '049d7878', normalized: 'xprv', validTargets: BTC_MAINNET_XPRV_PREFIXES },
    ypub: { version: '049d7cb2', normalized: 'xpub', validTargets: BTC_MAINNET_XPUB_PREFIXES },
    // mainnet P2WSH in P2SH
    Yprv: { version: '0295b005', normalized: 'xprv', validTargets: BTC_MAINNET_XPRV_PREFIXES },
    Ypub: { version: '0295b43f', normalized: 'xpub', validTargets: BTC_MAINNET_XPUB_PREFIXES },
    // mainnet P2WPKH
    zprv: { version: '04b2430c', normalized: 'xprv', validTargets: BTC_MAINNET_XPRV_PREFIXES },
    zpub: { version: '04b24746', normalized: 'xpub', validTargets: BTC_MAINNET_XPUB_PREFIXES },
    // mainnet P2WSH
    Zprv: { version: '02aa7a99', normalized: 'xprv', validTargets: BTC_MAINNET_XPRV_PREFIXES },
    Zpub: { version: '02aa7ed3', normalized: 'xpub', validTargets: BTC_MAINNET_XPUB_PREFIXES },
    // testnet P2PKH or P2SH
    tprv: { version: '04358394', normalized: 'tprv', validTargets: BTC_TESTNET_XPRV_PREFIXES },
    tpub: { version: '043587cf', normalized: 'tpub', validTargets: BTC_TESTNET_XPUB_PREFIXES },
    // testnet P2WPKH in P2SH
    uprv: { version: '044a4e28', normalized: 'tprv', validTargets: BTC_TESTNET_XPRV_PREFIXES },
    upub: { version: '044a5262', normalized: 'tpub', validTargets: BTC_TESTNET_XPUB_PREFIXES },
    // testnet P2WSH in P2SH
    Uprv: { version: '024285b5', normalized: 'tprv', validTargets: BTC_TESTNET_XPRV_PREFIXES },
    Upub: { version: '024289ef', normalized: 'tpub', validTargets: BTC_TESTNET_XPUB_PREFIXES },
    // testnet P2WPKH
    vprv: { version: '045f18bc', normalized: 'tprv', validTargets: BTC_TESTNET_XPRV_PREFIXES },
    vpub: { version: '045f1cf6', normalized: 'tpub', validTargets: BTC_TESTNET_XPUB_PREFIXES },
    // testnet P2WSH
    Vprv: { version: '02575048', normalized: 'tprv', validTargets: BTC_TESTNET_XPRV_PREFIXES },
    Vpub: { version: '02575483', normalized: 'tpub', validTargets: BTC_TESTNET_XPUB_PREFIXES }
};

type ConvertParams = {
    extKey?: string,
    targetFormat?: string,
    wif?: string,
    output?: boolean
};

/**
 * Conversions are meaningful only between members of the same group but possible between any pairs:
 *      - Mainnet priv: xprv, yprv, Yprv, zprv, Zprv
 *      - Mainnet pub: xpub, ypub, Ypub, zpub, Zpub
 *      - Testnet priv: tprv, uprv, Uprv, vprv, Vprv
 *      - Testnet pub: tpub, upub, Upub, vpub, Vpub
 * @param extKey            an extended key
 * @param targetFormat      the format you want to convert the extKey into e.g. 'tpub', 'xpub' etc.
 */
function convertExtendedKey({ extKey, targetFormat, output = false }: ConvertParams): string {
    extKey = extKey.trim();
    let converted;
    try {
        converted = bs58Check.encode(Buffer.concat([Buffer.from(EXT_KEY_DATA[targetFormat].version, 'hex'), bs58Check.decode(extKey).slice(4)]));
    } catch (err) {
        throw new Error('Invalid extended public key' + err);
    }
    if (output) {
        console.log(converted);
        return;
    }
    return converted;
}

function convertWIF2PrivKey({ wif, output = false }: ConvertParams): string {
    // First decode WIF; decoded form is without checksum
    let keyBuffer = bs58Check.decode(wif);
    // Drop version byte (e.g. 0xEF for btc testnet, 0x80 for btc mainnet)
    keyBuffer = keyBuffer.subarray(1, keyBuffer.length);
    // If still not 32 bytes, means it has compression byte; drop it too
    if (keyBuffer.length !== 32) {
        keyBuffer = keyBuffer.subarray(0, keyBuffer.length - 1);
        if (keyBuffer.length !== 32) {
            throw new Error('Invalid private key length');
        }
    }
    if (output) {
        console.log(keyBuffer.toString('hex'));
    }
    return keyBuffer.toString('hex');
}

function validateParams(params: ConvertParams): void {
    if ((params.extKey && !params.targetFormat) ||
        (!params.extKey && params.targetFormat) ||
        (!params.extKey && !params.targetFormat && !params.wif)) {
        throw new Error('Too few params. Should provide either --ext-key and --target-format or --wif.');
    }
    if ((params.extKey && params.wif) || (params.targetFormat && params.wif)) {
        throw new Error('Too many parameters. Should provide either --ext-key and --target-format or --wif.');
    }
    if (params.extKey) {
        // check if source => target formats is meaningful
        const extKeyPrefix = params.extKey.slice(0, 4);
        if (!EXT_KEY_DATA[extKeyPrefix].validTargets.includes(params.targetFormat)) {
            throw new Error(`Does not make sense to convert ${extKeyPrefix} extended key to ${params.targetFormat}`);
        }
    }
    if (params.targetFormat && !Object.getOwnPropertyNames(EXT_KEY_DATA).includes(params.targetFormat)) {
        throw new Error(`Invalid target-format: "${params.targetFormat}"; valid target-formats are ${JSON.stringify(Object.getOwnPropertyNames(EXT_KEY_DATA))}`);
    }
}

/**
 * Converts an extended key into corresponding format bitcoinjs-lib can understand;
 * bitcoinjs-lib only understands xprv, xpub, tprv and tpub
 */
export function normalizeExtKey(extKey: string): string {
    const extKeyPrefix = extKey.slice(0, 4);
    const targetFormat = EXT_KEY_DATA[extKeyPrefix].normalized;
    assert(targetFormat, `Do not know how to convert ext key with prefix "${extKeyPrefix}"`);
    return convertExtendedKey({ extKey, targetFormat });
}

export function convert({ extKey, targetFormat, wif, output }: ConvertParams): string {
    validateParams({ extKey, targetFormat, wif });
    if (extKey) {
        return convertExtendedKey({ extKey, targetFormat, output });
    } else if (wif) {
        return convertWIF2PrivKey({ wif, output });
    }
}