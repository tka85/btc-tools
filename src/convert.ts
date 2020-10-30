import program = require('commander');
import bs58Check = require('bs58check');
import { BTC_MAINNET_XPRV_PREFIXES, BTC_MAINNET_XPUB_PREFIXES, BTC_TESTNET_XPRV_PREFIXES, BTC_TESTNET_XPUB_PREFIXES, isValidExtKey } from './lib/utils';

const EXTENDED_KEY_VERSION_BYTES = {
    xprv: '0488ade4', // mainnet P2PKH or P2SH
    xpub: '0488b21e',
    yprv: '049d7878', // mainnet P2WPKH in P2SH
    ypub: '049d7cb2',
    Yprv: '0295b005', // mainnet P2WSH in P2SH
    Ypub: '0295b43f',
    zprv: '04b2430c', // mainnet P2WPKH
    zpub: '04b24746',
    Zprv: '02aa7a99', // mainnet P2WSH
    Zpub: '02aa7ed3',
    tprv: '04358394', // testnet P2PKH or P2SH
    tpub: '043587cf',
    uprv: '044a4e28', // testnet P2WPKH in P2SH
    upub: '044a5262',
    Uprv: '024285b5', // testnet P2WSH in P2SH
    Upub: '024289ef',
    vprv: '045f18bc', // testnet P2WPKH
    vpub: '045f1cf6',
    Vprv: '02575048',  // testnet P2WSH
    Vpub: '02575483'
};

type convertExtKeyParams = {
    extKey: string,
    targetFormat: string,
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
export function convertExtendedKey({ extKey, targetFormat, output = false }: convertExtKeyParams) {
    validateParams({ extKey, targetFormat });
    const meaningfulConversions = {
        mainnetXprv: new Set(BTC_MAINNET_XPRV_PREFIXES),
        mainnetXpub: new Set(BTC_MAINNET_XPUB_PREFIXES),
        testnetXprv: new Set(BTC_TESTNET_XPRV_PREFIXES),
        testnetXpub: new Set(BTC_TESTNET_XPUB_PREFIXES)
    };
    // TODO: throw error if we detect a meaningless conversion i.e. source and dest are not in same group

    extKey = extKey.trim();
    let converted;
    try {
        converted = bs58Check.encode(Buffer.concat([Buffer.from(EXTENDED_KEY_VERSION_BYTES[targetFormat], 'hex'), bs58Check.decode(extKey).slice(4)]));
    } catch (err) {
        throw new Error('Invalid extended public key' + err);
    }
    if (output) {
        console.log(converted);
        return;
    }
    return converted;
}

export function convertWIF2Buffer(wif: string): Buffer {
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
    return keyBuffer;
}

function validateParams(params: convertExtKeyParams): void {
    // Cannot use utils.isValidExtKey() because it only understand xpub/xprv and tpub/tprv
    // but none of the other formats (bitcoinjs library limitation). Just validate the targetFormat.
    if (!Object.keys(EXTENDED_KEY_VERSION_BYTES).includes(params.targetFormat)) {
        throw new Error(`Invalid target-format: "${params.targetFormat}"; valid target-formats are ${JSON.stringify(Object.keys(EXTENDED_KEY_VERSION_BYTES))}`);
    }
}

if (require.main === module) {
    program.requiredOption('-x, --ext-key <base58ExtendedKey>', 'an extended prv or pub key')
        .requiredOption('-t, --target-format <extendedKeyType>', 'the format to convert the given source key into; recognized types: [xyYzZ]prv, [xyYzZ]pub, [tuUvV]prv, [tuUvV]pub');
    // used on command line
    program.parse(process.argv);
    validateParams({ extKey: program.extKey, targetFormat: program.targetFormat });
    convertExtendedKey({ extKey: program.extKey, targetFormat: program.targetFormat, output: true });
}
