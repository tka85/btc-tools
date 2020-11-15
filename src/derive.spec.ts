import { derive } from './derive';
import { throws, deepEqual } from 'assert';

describe('derive', () => {
    const tprv = 'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK';
    const tpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B';
    const path = 'm/0';
    const hardenedPath0 = "0'";
    const hardenedPath1 = '0h';
    const invalidChecksumTpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXEL';
    const invalidPath = '///';
    describe('for Bitcoin testnet', () => {
        const derivedNonHardenedNotNeutered = [{
            p2wpkh: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp',
            depth: 2,
            p2pkh: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_p2wpkh: '2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp',
            path: 'm/0/0',
            pubkey: '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
            wif: 'cTiN5q13XR9ebmqfXbaCbz2x6C6inEJWqoJ5jP4CCw98ZCJ4gkuN'
        }];
        const derivedNonHardenedNotNeuteredAllColumns = [{
            path: 'm/0/0',
            depth: 2,
            p2pkh: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_p2wpkh: '2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp',
            p2wpkh: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp',
            xprv: 'tprv8etcjmQgEyf5nAsLDRee1pYNZKNppSMguV9hb4w1LE39FcwyrXJmSBoz9Q4X7soMJrZT97Ynv4kAxpm7tQy55dmvuKyxWH6LpbmBWAQQ2SW',
            xpub: 'tpubDBaetBSvPMLkfdu875KERECV8LtkymYbUnkUsayJkVqY67CkUv8McgRrKX9aGuf23GQjr5BLUzQzirpbX676mSr5ExrG6FtPKEMuyP88AMu',
            privkey: 'b6f762e107af1dd4c73f7f1ce84298d71ec07a0a66fb8d8f24551f99435af082',
            pubkey: '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
            pubkey_hash: 'd95fc47eada9e4c3cf59a2cbf9e96517c3ba2efa',
            wif: 'cTiN5q13XR9ebmqfXbaCbz2x6C6inEJWqoJ5jP4CCw98ZCJ4gkuN',
            fingerprint: 'd95fc47e',
            legacy: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            bech32: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp'
        }];
        const derivedNonHardenedNeutered = [{
            p2wpkh: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp',
            depth: 2,
            p2pkh: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_p2wpkh: '2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp',
            path: 'm/0/0',
            pubkey: '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
            wif: null
        }];
        const derivedHardened = [{
            p2wpkh: 'tb1qalzchqutx9f3wjln69nhkusnx5aymn8a5tyk9c',
            depth: 2,
            p2pkh: 'n3NkSZqoPMCQN5FENxUBw4qVATbytH6FDK',
            p2sh_p2wpkh: '2NA9LWMy8Bn5QTs5CB5Z8Fbqm66oDbp8KL4',
            path: "m/0'/0",
            pubkey: '02fcba7ecf41bc7e1be4ee122d9d22e3333671eb0a3a87b5cdf099d59874e1940f',
            wif: 'cNaQCDwmmh4dS9LzCgVtyy1e1xjCJ21GUDHe9K98nzb689JvinGV'
        }];
        const derivedHardenedChild = [{
            p2wpkh: 'tb1q97fke3clxkzr5hr8hq7yadd7ljs3lchehh0kv0',
            depth: 2,
            p2pkh: 'mjrWfLF9MemTz6jL4yuWZ3qWuA9thoUZMe',
            p2sh_p2wpkh: '2N6aBpWwCaUovasCfWJmnNLVpBh6D9ChBUW',
            path: "m/0/0'",
            pubkey: '028b286667010c16638ef5769831efe2cbe0c72b8555e56692694d3b0900704b57',
            wif: 'cQJ9KFJkWqMfYbQpXvVQKCMHBwMorvtR81JZsiYP9dFWMe2sP1Hc'
        }];
        const derived00CustomCols = [{ p2wpkh: 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp' }];
        const derived00WithRoot = [{
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
        }];
        it('should fail if missing key', () => {
            throws(() => { derive({ extKey: undefined, path: '0/0', hardenedChildren: false, network: 'btctest' }) });
        });
        it('should fail if key is invalid', () => {
            throws(() => { derive({ extKey: invalidChecksumTpub, path: '0/0', hardenedChildren: false, network: 'btctest' }) }, 'Error: Invalid param for ext key: "tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXEL"');
        });
        it('should fail if path is invalid', () => {
            throws(() => { derive({ extKey: tpub, path: invalidPath, hardenedChildren: false, network: 'btctest' }) }, /Expected BIP32Path, got String ".*"/);
        });
        it('should derive correctly from tprv', () => {
            deepEqual(derive({ extKey: tprv, path, hardenedChildren: false, count: 1, network: 'btctest' }), derivedNonHardenedNotNeutered);
        });
        it('should derive correctly from tprv', () => {
            deepEqual(derive({ extKey: tprv, path, hardenedChildren: false, count: 1, cols: 'all', network: 'btctest' }), derivedNonHardenedNotNeuteredAllColumns);
        });
        it('should derive correctly from tpub', () => {
            deepEqual(derive({ extKey: tpub, path, hardenedChildren: false, count: 1, network: 'btctest' }), derivedNonHardenedNeutered);
        });
        it('should derive correctly with custom columns', () => {
            deepEqual(derive({ extKey: tpub, path, cols: 'p2wpkh', hardenedChildren: false, count: 1, network: 'btctest' }), derived00CustomCols);
        });
        it('should derive correctly including root', () => {
            deepEqual(derive({ extKey: tpub, path, hardenedChildren: false, includeRoot: true, count: 1, network: 'btctest' }), derived00WithRoot);
        });
        it('should derive correctly hardened path (both formats)', () => {
            deepEqual(derive({ extKey: tprv, path: hardenedPath0, hardenedChildren: false, includeRoot: false, count: 1, network: 'btctest' }), derivedHardened);
            deepEqual(derive({ extKey: tprv, path: hardenedPath1, hardenedChildren: false, includeRoot: false, count: 1, network: 'btctest' }), derivedHardened);
        });
        it('should derive correctly hardened children', () => {
            deepEqual(derive({ extKey: tprv, path, hardenedChildren: true, includeRoot: false, count: 1, network: 'btctest' }), derivedHardenedChild);
        });
    });
    describe('for Litecoin testnet', () => {
        const derivedNonHardenedNotNeutered = [{
            p2wpkh: 'tltc1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th6u8w6qg',
            depth: 2,
            p2pkh: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_p2wpkh: 'QW3AT1bifAAmVKa3vfzbFSu3wfqMLULs3b',
            path: 'm/0/0',
            pubkey: '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
            wif: 'cTiN5q13XR9ebmqfXbaCbz2x6C6inEJWqoJ5jP4CCw98ZCJ4gkuN'
        }];
        const derivedNonHardenedNotNeuteredAllColumns = [{
            path: 'm/0/0',
            depth: 2,
            p2pkh: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_p2wpkh: 'QW3AT1bifAAmVKa3vfzbFSu3wfqMLULs3b',
            p2wpkh: 'tltc1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th6u8w6qg',
            xprv: 'tprv8etcjmQgEyf5nAsLDRee1pYNZKNppSMguV9hb4w1LE39FcwyrXJmSBoz9Q4X7soMJrZT97Ynv4kAxpm7tQy55dmvuKyxWH6LpbmBWAQQ2SW',
            xpub: 'tpubDBaetBSvPMLkfdu875KERECV8LtkymYbUnkUsayJkVqY67CkUv8McgRrKX9aGuf23GQjr5BLUzQzirpbX676mSr5ExrG6FtPKEMuyP88AMu',
            privkey: 'b6f762e107af1dd4c73f7f1ce84298d71ec07a0a66fb8d8f24551f99435af082',
            pubkey: '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
            pubkey_hash: 'd95fc47eada9e4c3cf59a2cbf9e96517c3ba2efa',
            wif: 'cTiN5q13XR9ebmqfXbaCbz2x6C6inEJWqoJ5jP4CCw98ZCJ4gkuN',
            fingerprint: 'd95fc47e',
            legacy: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            bech32: 'tltc1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th6u8w6qg'
        }];
        const derivedNonHardenedNeutered = [{
            p2wpkh: 'tltc1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th6u8w6qg',
            depth: 2,
            p2pkh: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_p2wpkh: 'QW3AT1bifAAmVKa3vfzbFSu3wfqMLULs3b',
            path: 'm/0/0',
            pubkey: '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
            wif: null
        }];
        const derivedHardened = [{
            p2wpkh: 'tltc1qalzchqutx9f3wjln69nhkusnx5aymn8adrxg43',
            depth: 2,
            p2pkh: 'n3NkSZqoPMCQN5FENxUBw4qVATbytH6FDK',
            p2sh_p2wpkh: 'QdW6dNqNCt8Vc3qEoBb9LJHCEVF3TFk5pB',
            path: "m/0'/0",
            pubkey: '02fcba7ecf41bc7e1be4ee122d9d22e3333671eb0a3a87b5cdf099d59874e1940f',
            wif: 'cNaQCDwmmh4dS9LzCgVtyy1e1xjCJ21GUDHe9K98nzb689JvinGV'
        }];
        const derivedHardenedChild = [{
            p2wpkh: 'tltc1q97fke3clxkzr5hr8hq7yadd7ljs3lchewldgux',
            depth: 2,
            p2pkh: 'mjrWfLF9MemTz6jL4yuWZ3qWuA9thoUZMe',
            p2sh_p2wpkh: 'QZvwwXoSbas1j3xi8QooT2wFL5Y2zgqahe',
            path: "m/0/0'",
            pubkey: '028b286667010c16638ef5769831efe2cbe0c72b8555e56692694d3b0900704b57',
            wif: 'cQJ9KFJkWqMfYbQpXvVQKCMHBwMorvtR81JZsiYP9dFWMe2sP1Hc'
        }];
        const derived00CustomCols = [{ p2wpkh: 'tltc1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th6u8w6qg' }];
        const derived00WithRoot = [{
            p2wpkh: 'tltc1qp30e58hrp0etgsl2q9y4tar26a93nwc0h4du8u',
            depth: 0,
            p2pkh: 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud',
            p2sh_p2wpkh: 'QQdAqrJnNe168sZuBp7W9VcjxaYz118516',
            path: 'm/',
            pubkey: '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
            wif: null
        },
        {
            p2wpkh: 'tltc1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th6u8w6qg',
            depth: 2,
            p2pkh: 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9',
            p2sh_p2wpkh: 'QW3AT1bifAAmVKa3vfzbFSu3wfqMLULs3b',
            path: 'm/0/0',
            pubkey: '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
            wif: null
        }];
        it('should fail if missing key', () => {
            throws(() => { derive({ extKey: undefined, path: '0/0', hardenedChildren: false, network: 'ltctest' }) });
        });
        it('should fail if key is invalid', () => {
            throws(() => { derive({ extKey: invalidChecksumTpub, path: '0/0', hardenedChildren: false, network: 'ltctest' }) }, 'Error: Invalid param for ext key: "tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXEL"');
        });
        it('should fail if invalid path', () => {
            throws(() => { derive({ extKey: tpub, path: invalidPath, hardenedChildren: false, network: 'ltctest' }) }, /Expected BIP32Path, got String ".*"/);
        });
        it('should derive correctly from tprv', () => {
            deepEqual(derive({ extKey: tprv, path, hardenedChildren: false, count: 1, network: 'ltctest' }), derivedNonHardenedNotNeutered);
        });
        it('should derive correctly from tprv', () => {
            deepEqual(derive({ extKey: tprv, path, hardenedChildren: false, count: 1, cols: 'all', network: 'ltctest' }), derivedNonHardenedNotNeuteredAllColumns);
        });
        it('should derive correctly from tpub', () => {
            deepEqual(derive({ extKey: tpub, path, hardenedChildren: false, count: 1, network: 'ltctest' }), derivedNonHardenedNeutered);
        });
        it('should derive correctly with custom columns', () => {
            deepEqual(derive({ extKey: tpub, path, cols: 'p2wpkh', hardenedChildren: false, count: 1, network: 'ltctest' }), derived00CustomCols);
        });
        it('should derive correctly including root', () => {
            deepEqual(derive({ extKey: tpub, path, hardenedChildren: false, includeRoot: true, count: 1, network: 'ltctest' }), derived00WithRoot);
        });
        it('should derive correctly hardened path (both formats)', () => {
            deepEqual(derive({ extKey: tprv, path: hardenedPath0, hardenedChildren: false, includeRoot: false, count: 1, network: 'ltctest' }), derivedHardened);
            deepEqual(derive({ extKey: tprv, path: hardenedPath1, hardenedChildren: false, includeRoot: false, count: 1, network: 'ltctest' }), derivedHardened);
        });
        it('should derive correctly hardened children', () => {
            deepEqual(derive({ extKey: tprv, path, hardenedChildren: true, includeRoot: false, count: 1, network: 'ltctest' }), derivedHardenedChild);
        });
    });
});
