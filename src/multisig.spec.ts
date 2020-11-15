import { multisig } from './multisig';
import { deepStrictEqual } from 'assert';

describe('multisig', () => {
    const threshold = 2; // 2-of-3
    const total = 3;
    const pubKeys = '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7,03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0,023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772';
    const extKeys = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B,tpubD6NzVbkrYhZ4X1MhK22bdUwGstuq9gRABHLoRkm8yUMrS5WJSoo3W13RLbNBzcimJtQiYs8Nc41V9VCKEy5Y793eKK1TvkzSTAxr86wyMuW,tpubD6NzVbkrYhZ4Y3gMUefyddFS1Uob6tMSToYiLLzuWEfCs1KtTFVGZndPxiPaVPtaYebRCsSXdYZ43mWN2LnariYSWnLvLUkyQchghCcTN32';
    const network = 'btctest';
    const count = 1;
    let path;

    beforeEach(() => {
        path = '0';
    });

    describe('p2sh', () => {
        const multisigType = 'p2sh';
        it(`should derive a ${threshold}-of-${total} multisig address from public keys`, () => {
            deepStrictEqual(multisig({ multisigType, threshold, pubKeys, network }), [
                {
                    address: '2N6WamYHLh6KzBaDJeD3NumgdgnSA5qNqW2',
                    type: 'p2sh-2-of-3',
                    publicKeys: [
                        '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
                        '03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0',
                        '023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772'
                    ],
                    redeem: '522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae',
                    redeemASM: 'OP_2 02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7 03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0 023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772 OP_3 OP_CHECKMULTISIG',
                    scriptPubKey: 'a9149181389b4b877aec7d7557c4300658aa9218a68887'
                }
            ]);
        });
        it(`should derive a ${threshold}-of-${total} multisig address from ext keys`, () => {
            deepStrictEqual(multisig({ multisigType, threshold, extKeys, path, count, network }), [
                {
                    address: '2N6WamYHLh6KzBaDJeD3NumgdgnSA5qNqW2',
                    path: '0/0',
                    type: 'p2sh-2-of-3',
                    publicKeys: [
                        '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
                        '03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0',
                        '023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772'
                    ],
                    redeem: '522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae',
                    redeemASM: 'OP_2 02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7 03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0 023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772 OP_3 OP_CHECKMULTISIG',
                    scriptPubKey: 'a9149181389b4b877aec7d7557c4300658aa9218a68887'
                }
            ]);
        });
    });

    describe('p2shp2wsh', () => {
        const multisigType = 'p2shp2wsh';
        it(`should derive a ${threshold}-of-${total} multisig address from public keys`, () => {
            deepStrictEqual(multisig({ multisigType, threshold, pubKeys, network }), [
                {
                    address: '2Msyx1ZiiXmwvpf5gvJ1Xb671rgsfYRPPoH',
                    type: 'p2shp2wsh-2-of-3',
                    publicKeys: [
                        '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
                        '03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0',
                        '023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772'
                    ],
                    redeem: '522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae',
                    redeemASM: 'OP_2 02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7 03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0 023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772 OP_3 OP_CHECKMULTISIG',
                    scriptPubKey: 'a91408148c756080ea3bf0f35ee864a68cc165c892a087'
                }
            ]);
        });
        it(`should derive a ${threshold}-of-${total} multisig address from ext keys`, () => {
            deepStrictEqual(multisig({ multisigType, threshold, extKeys, path, count, network }), [
                {
                    address: '2Msyx1ZiiXmwvpf5gvJ1Xb671rgsfYRPPoH',
                    path: '0/0',
                    type: 'p2shp2wsh-2-of-3',
                    publicKeys: [
                        '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
                        '03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0',
                        '023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772'
                    ],
                    redeem: '522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae',
                    redeemASM: 'OP_2 02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7 03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0 023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772 OP_3 OP_CHECKMULTISIG',
                    scriptPubKey: 'a91408148c756080ea3bf0f35ee864a68cc165c892a087'
                }
            ]);
        });
    });

    describe('p2wsh', () => {
        const multisigType = 'p2wsh';
        it(`should derive a ${threshold}-of-${total} multisig address from public keys`, () => {
            deepStrictEqual(multisig({ multisigType, threshold, pubKeys, network }), [
                {
                    address: 'tb1q2pnadjwshn72xeeh53d33hdz0rnmeseg4varj37eu0gz5tujvd9qm76w37',
                    type: 'p2wsh-2-of-3',
                    publicKeys: [
                        '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
                        '03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0',
                        '023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772'
                    ],
                    redeem: '522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae',
                    redeemASM: 'OP_2 02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7 03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0 023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772 OP_3 OP_CHECKMULTISIG'
                }
            ]);
        });
        it(`should derive a ${threshold}-of-${total} multisig address from ext keys`, () => {
            deepStrictEqual(multisig({ multisigType, threshold, extKeys, path, count, network }), [
                {
                    address: 'tb1q2pnadjwshn72xeeh53d33hdz0rnmeseg4varj37eu0gz5tujvd9qm76w37',
                    path: '0/0',
                    type: 'p2wsh-2-of-3',
                    publicKeys: [
                        '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
                        '03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0',
                        '023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772'
                    ],
                    redeem: '522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae',
                    redeemASM: 'OP_2 02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7 03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0 023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772 OP_3 OP_CHECKMULTISIG'
                }
            ]);
        });
    });
});
