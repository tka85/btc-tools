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

type convertXpubParams = {
    extKey: string,
    toFormat: string,
    printStdout?: boolean
};

/**
 * Conversions is meaningful only between members of the same group but possible between any pairs:
 *      - Mainnet priv: xprv, yprv, Yprv, zprv, Zprv
 *      - Mainnet pub: xpub, ypub, Ypub, zpub, Zpub
 *      - Testnet priv: tprv, uprv, Uprv, vprv, Vprv
 *      - Testnet pub: tpub, upub, Upub, vpub, Vpub
 * We throw error if conversion does not make sense
 * @param extKey        an extended key
 * @param toFormat      the format you want to convert the extKey into e.g. 'tpub', 'xpub' etc.
 */
export function convertExtendedKey({ extKey, toFormat, printStdout = false }: convertXpubParams) {
    validateParams({ extKey, toFormat });
    const meaningfulConversions = {
        mainnetXprv: new Set(BTC_MAINNET_XPRV_PREFIXES),
        mainnetXpub: new Set(BTC_MAINNET_XPUB_PREFIXES),
        testnetXprv: new Set(BTC_TESTNET_XPRV_PREFIXES),
        testnetXpub: new Set(BTC_TESTNET_XPUB_PREFIXES)
    };
    // TODO: throw error if we detect a meaningless conversion i.e. source and dest are not in same group

    extKey = extKey.trim();
    let result;
    try {
        result = bs58Check.encode(Buffer.concat([Buffer.from(EXTENDED_KEY_VERSION_BYTES[toFormat], 'hex'), bs58Check.decode(extKey).slice(4)]));
    } catch (err) {
        throw new Error('Invalid extended public key' + err);
    }
    if (printStdout) {
        console.log(result);
    }
    return result;
}

function validateParams(params: convertXpubParams): void {
    // NOTE: cannot use utils.isValidExtKey() because it only understand xpub/xprv and tpub/tprv 
    // but none of the other formats (bitcoinjs library limitation)
    // So just validate the toFormat
    if (!Object.keys(EXTENDED_KEY_VERSION_BYTES).includes(params.toFormat)) {
        throw new Error(`Invalid to-format: "${params.toFormat}"; valid to-formats are ${JSON.stringify(Object.keys(EXTENDED_KEY_VERSION_BYTES))}`);
    }
}

if (require.main === module) {
    // used on command line
    program.requiredOption('-x, --ext-key <base58ExtendedKey>', 'an extended prv or pub key')
        .requiredOption('-d, --to-format <extendedKeyType>', 'the format to convert the given source key into; recognized types: [xyYzZ]prv, [xyYzZ]pub, [tuUvV]prv, [tuUvV]pub');
    program.parse(process.argv);
    validateParams({ extKey: program.extKey, toFormat: program.toFormat });
    convertExtendedKey({ extKey: program.extKey, toFormat: program.toFormat, printStdout: true });
}
