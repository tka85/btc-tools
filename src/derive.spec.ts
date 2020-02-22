import derive from './derive';
import { throws, deepEqual } from 'assert';

describe('derive', () => {
    const tprv = 'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK';
    const tpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B';
    const path = 'm/0';
    const hardenedPath0 = "0'";
    const hardenedPath1 = '0h';
    const derivedNonHardened = [
        {
            bech32: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp',
            depth: 2,
            legacy: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_segwit: '2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp',
            path: 'm/0/0'
        }
    ];
    const derivedHardened = [
        {
            bech32: 'tb1qalzchqutx9f3wjln69nhkusnx5aymn8a5tyk9c',
            depth: 2,
            legacy: 'n3NkSZqoPMCQN5FENxUBw4qVATbytH6FDK',
            p2sh_segwit: '2NA9LWMy8Bn5QTs5CB5Z8Fbqm66oDbp8KL4',
            path: "m/0'/0"
        }
    ];
    const derivedHardenedChild = [
        {
            bech32: 'tb1q97fke3clxkzr5hr8hq7yadd7ljs3lchehh0kv0',
            depth: 2,
            legacy: 'mjrWfLF9MemTz6jL4yuWZ3qWuA9thoUZMe',
            p2sh_segwit: '2N6aBpWwCaUovasCfWJmnNLVpBh6D9ChBUW',
            path: "m/0/0'"
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
    const invalidPath = '///';
    it('should fail if missing key', () => {
        throws(() => { derive({ key: undefined, path: '0/0', hardenedChildren: false, }) }, /missing extended key/);
    });
    it('should fail if missing path', () => {
        throws(() => { derive({ key: tpub, path: undefined, hardenedChildren: false, }) }, /missing or invalid path/);
    });
    it('should fail if key not of known type', () => {
        throws(() => { derive({ key: 'UNKOWNtpub', path: '0/0', hardenedChildren: false, }) }, /Do not know how to convert ext key with prefix "UNKO"/);
    });
    it('should fail if key of known type but invalid key', () => {
        throws(() => { derive({ key: invalidTpub, path: '0/0', hardenedChildren: false, }) }, /Invalid extended public keyError: Invalid checksum/);
    });
    it('should fail if invalid path', () => {
        throws(() => { derive({ key: tpub, path: invalidPath, hardenedChildren: false, }) }, /Expected BIP32Path, got String ".*"/);
    });
    it('should derive correctly from tprv', () => {
        deepEqual(derive({ key: tprv, path, hardenedChildren: false, count: 1 }), derivedNonHardened);
    });
    it('should derive correctly from tpub', () => {
        deepEqual(derive({ key: tpub, path, hardenedChildren: false, count: 1 }), derivedNonHardened);
    });
    it('should derive correctly with custom columns', () => {
        deepEqual(derive({ key: tpub, path, cols: 'bech32', hardenedChildren: false, count: 1 }), derived00CustomCols);
    });
    it('should derive correctly including root', () => {
        deepEqual(derive({ key: tpub, path, hardenedChildren: false, includeRoot: true, count: 1 }), derived00WithRoot);
    });
    it('should derive correctly hardened path (both formats)', () => {
        deepEqual(derive({ key: tprv, path: hardenedPath0, hardenedChildren: false, includeRoot: false, count: 1 }), derivedHardened);
        deepEqual(derive({ key: tprv, path: hardenedPath1, hardenedChildren: false, includeRoot: false, count: 1 }), derivedHardened);
    });
    it('should derive correctly hardened children', () => {
        deepEqual(derive({ key: tprv, path, hardenedChildren: true, includeRoot: false, count: 1 }), derivedHardenedChild);
    });
});