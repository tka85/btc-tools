import assert = require('assert');
import program = require('commander');
import bs58Check = require('bs58check');
import { BTC_MAINNET_XPRV_PREFIXES, BTC_MAINNET_XPUB_PREFIXES, BTC_TESTNET_XPRV_PREFIXES, BTC_TESTNET_XPUB_PREFIXES, validateExtKey } from './lib/utils';

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

/**
 * Conversions is meaningful only between members of the same group but possible between any pairs:
 *      - Mainnet priv: xprv, yprv, Yprv, zprv, Zprv
 *      - Mainnet pub: xpub, ypub, Ypub, zpub, Zpub
 *      - Testnet priv: tprv, uprv, Uprv, vprv, Vprv
 *      - Testnet pub: tpub, upub, Upub, vpub, Vpub
 * We throw error if conversion does not make sense
 * @param sourceKey     an extended key
 * @param destFormat    the format you want to convert the sourceKey into e.g. 'tpub', 'xpub' etc.
 */
function convertExtendedKey({ sourceKey, destFormat, printStdout = false }: { sourceKey: string, destFormat: string, printStdout?: boolean }) {
    assert(sourceKey, 'missing extended source key');
    assert(destFormat, 'missing destination key format');
    const meaningfulConversions = {
        mainnetXprv: new Set(BTC_MAINNET_XPRV_PREFIXES),
        mainnetXpub: new Set(BTC_MAINNET_XPUB_PREFIXES),
        testnetXprv: new Set(BTC_TESTNET_XPRV_PREFIXES),
        testnetXpub: new Set(BTC_TESTNET_XPUB_PREFIXES)
    };
    // TODO: throw error if we detect a meaningless conversion i.e. source and dest are not in same group

    if (!Object.keys(EXTENDED_KEY_VERSION_BYTES).includes(destFormat)) {
        throw new Error(`Invalid destination format; valid destination formats are ${JSON.stringify(Object.keys(EXTENDED_KEY_VERSION_BYTES))}`);
    }
    if (!Object.keys(EXTENDED_KEY_VERSION_BYTES).includes(sourceKey.slice(0, 4))) {
        throw new Error(`Invalid source key prefix; valid extended key prefixes are ${JSON.stringify(Object.keys(EXTENDED_KEY_VERSION_BYTES))}`);
    }
    sourceKey = sourceKey.trim();
    let result;
    try {
        result = bs58Check.encode(Buffer.concat([Buffer.from(EXTENDED_KEY_VERSION_BYTES[destFormat], 'hex'), bs58Check.decode(sourceKey).slice(4)]));
    } catch (err) {
        throw new Error('Invalid extended public key' + err);
    }
    if (printStdout) {
        console.log(result);
    }
    return result;
}

function validateParams() {
    validateExtKey(program.sourceKey);
}

if (require.main === module) {
    // used on command line
    program.requiredOption('-s, --source-key <base58ExtendedKey>', 'an extended key')
        .requiredOption('-d, --destination-format <extendedKeyType>', 'the format to convert the given source key into; recognized types: [xyYzZ]prv, [xyYzZ]pub, [tuUvV]prv, [tuUvV]pub');
    program.parse(process.argv);
    validateParams();
    convertExtendedKey({ sourceKey: program.sourceKey, destFormat: program.destinationFormat, printStdout: true });
}

// used as a module
export default convertExtendedKey;