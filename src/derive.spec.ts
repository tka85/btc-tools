import { derive } from './derive';
import { throws, deepEqual } from 'assert';

describe('derive', () => {
    const tprv = 'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK';
    const tpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B';
    const path = 'm/0';
    const hardenedPath0 = "0'";
    const hardenedPath1 = '0h';
    const derivedNonHardenedNotNeutered = [
        {
            p2wpkh: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp',
            depth: 2,
            p2pkh: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_p2wpkh: '2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp',
            path: 'm/0/0',
            pubkey: '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
            wif: 'cTiN5q13XR9ebmqfXbaCbz2x6C6inEJWqoJ5jP4CCw98ZCJ4gkuN'
        }
    ];
    const derivedNonHardenedNeutered = [
        {
            p2wpkh: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp',
            depth: 2,
            p2pkh: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_p2wpkh: '2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp',
            path: 'm/0/0',
            pubkey: '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
            wif: null
        }
    ];
    const derivedHardened = [
        {
            p2wpkh: 'tb1qalzchqutx9f3wjln69nhkusnx5aymn8a5tyk9c',
            depth: 2,
            p2pkh: 'n3NkSZqoPMCQN5FENxUBw4qVATbytH6FDK',
            p2sh_p2wpkh: '2NA9LWMy8Bn5QTs5CB5Z8Fbqm66oDbp8KL4',
            path: "m/0'/0",
            pubkey: '02fcba7ecf41bc7e1be4ee122d9d22e3333671eb0a3a87b5cdf099d59874e1940f',
            wif: 'cNaQCDwmmh4dS9LzCgVtyy1e1xjCJ21GUDHe9K98nzb689JvinGV'
        }
    ];
    const derivedHardenedChild = [
        {
            p2wpkh: 'tb1q97fke3clxkzr5hr8hq7yadd7ljs3lchehh0kv0',
            depth: 2,
            p2pkh: 'mjrWfLF9MemTz6jL4yuWZ3qWuA9thoUZMe',
            p2sh_p2wpkh: '2N6aBpWwCaUovasCfWJmnNLVpBh6D9ChBUW',
            path: "m/0/0'",
            pubkey: '028b286667010c16638ef5769831efe2cbe0c72b8555e56692694d3b0900704b57',
            wif: 'cQJ9KFJkWqMfYbQpXvVQKCMHBwMorvtR81JZsiYP9dFWMe2sP1Hc'
        }
    ];
    const derived00CustomCols = [{ p2wpkh: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp' }];
    const derived00WithRoot = [
        {
            p2wpkh: 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4',
            depth: 0,
            p2pkh: 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud',
            p2sh_p2wpkh: '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY',
            path: 'm/',
            pubkey: '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
            wif: null
        },
        {
            p2wpkh: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp',
            depth: 2,
            p2pkh: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_p2wpkh: '2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp',
            path: 'm/0/0',
            pubkey: '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
            wif: null
        }
    ];
    const invalidChecksumTpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXEL';
    const invalidPath = '///';
    it('should fail if missing key', () => {
        throws(() => { derive({ extKey: undefined, path: '0/0', hardenedChildren: false, }) });
    });
    it('should fail if missing path', () => {
        throws(() => { derive({ extKey: tpub, path: undefined, hardenedChildren: false, }) });
    });
    it('should fail if key is invalid', () => {
        throws(() => { derive({ extKey: invalidChecksumTpub, path: '0/0', hardenedChildren: false, }) }, 'Error: Invalid param for ext key: "tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXEL"');
    });
    it('should fail if invalid path', () => {
        throws(() => { derive({ extKey: tpub, path: invalidPath, hardenedChildren: false, }) }, /Expected BIP32Path, got String ".*"/);
    });
    it('should derive correctly from tprv', () => {
        deepEqual(derive({ extKey: tprv, path, hardenedChildren: false, count: 1 }), derivedNonHardenedNotNeutered);
    });
    it('should derive correctly from tpub', () => {
        deepEqual(derive({ extKey: tpub, path, hardenedChildren: false, count: 1 }), derivedNonHardenedNeutered);
    });
    it('should derive correctly with custom columns', () => {
        deepEqual(derive({ extKey: tpub, path, cols: 'p2wpkh', hardenedChildren: false, count: 1 }), derived00CustomCols);
    });
    it('should derive correctly including root', () => {
        deepEqual(derive({ extKey: tpub, path, hardenedChildren: false, includeRoot: true, count: 1 }), derived00WithRoot);
    });
    it('should derive correctly hardened path (both formats)', () => {
        deepEqual(derive({ extKey: tprv, path: hardenedPath0, hardenedChildren: false, includeRoot: false, count: 1 }), derivedHardened);
        deepEqual(derive({ extKey: tprv, path: hardenedPath1, hardenedChildren: false, includeRoot: false, count: 1 }), derivedHardened);
    });
    it('should derive correctly hardened children', () => {
        deepEqual(derive({ extKey: tprv, path, hardenedChildren: true, includeRoot: false, count: 1 }), derivedHardenedChild);
    });
});