import derive from './derive';
import { throws, deepEqual } from 'assert';
import bitcoinjs = require('bitcoinjs-lib');

describe('derive', () => {
    const tpriv = 'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK';
    const tpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B';
    const network = 'testnet';
    const path = 'm/0';
    const derived00 = [
        {
            bech32: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp',
            depth: 2,
            legacy: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_segwit: '2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp',
            path: 'm/0/0'
        }
    ];
    const derived00CustomCols = [{ bech32: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp' }];
    const derived00WithRoot = [
        {
            bech32: "tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4",
            depth: 0,
            legacy: "mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud",
            p2sh_segwit: "2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY",
            path: "m/"
        },
        {
            bech32: "tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp",
            depth: 2,
            legacy: "n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9",
            p2sh_segwit: "2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp",
            path: "m/0/0"
        }
    ];
    const invalidTpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXEL';
    const invalidNetwork = 'foonet';
    const invalidPath = '///';
    it('should fail if missing key', () => {
        throws(() => { derive({ key: undefined, network: 'testnet', path: '0/0' }) }, /missing extended key/);
    });
    it('should fail if missing network', () => {
        throws(() => { derive({ key: tpub, network: undefined, path: '0/0' }) }, /missing network/);
    });
    it('should fail if missing path', () => {
        throws(() => { derive({ key: tpub, network: 'testnet', path: undefined }) }, /missing or invalid path/);
    });
    it('should fail if key not of known type', () => {
        throws(() => { derive({ key: 'UNKOWNtpub', network: 'testnet', path: '0/0' }) }, /Do not know how to convert ext key with prefix "UNKO"/);
    });
    it('should fail if invalid network', () => {
        throws(() => { derive({ key: tpub, network: invalidNetwork, path: '0/0' }) }, /Invalid network specified: "foonet"; expected "mainnet" or "testnet"/);
    });
    it('should fail if key of known type but invalid key', () => {
        throws(() => { derive({ key: invalidTpub, network: 'testnet', path: '0/0' }) }, /Invalid extended public keyError: Invalid checksum/);
    });
    it('should fail if invalid path', () => {
        throws(() => { derive({ key: tpub, network: 'testnet', path: invalidPath }) }, /Expected BIP32Path, got String ".*"/);
    });
    it('should derive correctly from tprv', () => {
        deepEqual(derive({ key: tpriv, network, path, count: 1 }), derived00);
    });
    it('should derive correctly from tpub', () => {
        deepEqual(derive({ key: tpub, network, path, count: 1 }), derived00);
    });
    it('should derive correctly with custom columns', () => {
        deepEqual(derive({ key: tpub, network, path, cols: 'bech32', count: 1 }), derived00CustomCols);
    });
    it('should derive correctly including root', () => {
        deepEqual(derive({ key: tpub, network, path, includeRoot: true, count: 1 }), derived00WithRoot);
    });
});