import { deriveMultisig, MULTISIG_FUNCS } from './multisig';
import { throws, deepEqual } from 'assert';
import bitcoinjs = require('bitcoinjs-lib');
import bip32 = require('bip32');
import DerivationPath from './lib/DerivationPath';

describe('multisig', () => {
    const threshold = 2; // 2-of-3
    const total = 3;

    const pubKeys = ['02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7', '03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0', '023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772'];
    const pubKeyBuffers: Buffer[] = pubKeys.map(_ => Buffer.from(_, 'hex'));

    const xpubKeys = ['tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B', 'tpubD6NzVbkrYhZ4X1MhK22bdUwGstuq9gRABHLoRkm8yUMrS5WJSoo3W13RLbNBzcimJtQiYs8Nc41V9VCKEy5Y793eKK1TvkzSTAxr86wyMuW', 'tpubD6NzVbkrYhZ4Y3gMUefyddFS1Uob6tMSToYiLLzuWEfCs1KtTFVGZndPxiPaVPtaYebRCsSXdYZ43mWN2LnariYSWnLvLUkyQchghCcTN32'];
    const network = bitcoinjs.networks.testnet;
    const xpubNodes: bip32.BIP32Interface[] = xpubKeys.map(_ => bip32.fromBase58(_, network));
    const path = new DerivationPath('0');
    const count = 1;

    describe('p2sh', () => {
        const multisigFunc = MULTISIG_FUNCS.p2sh;
        it(`should derive a ${threshold}-of-${total} multisig address from public keys`, () => {
            deepEqual(deriveMultisig({ multisigFunc, threshold, pubKeyBuffers }), [
                {
                    address: '3ExNhoMK5dpdynaky5RWHphNUSDzFDVa8W',
                    type: 'p2sh-2-of-3',
                    publicKeys: [
                        '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
                        '03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0',
                        '023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772'
                    ],
                    redeem: '522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae'
                }
            ]);
        });
        it(`should derive a ${threshold}-of-${total} multisig address from xpub keys`, () => {
            deepEqual(deriveMultisig({ multisigFunc, threshold, xpubNodes, path, count }), [
                {
                    address: '3ExNhoMK5dpdynaky5RWHphNUSDzFDVa8W',
                    path: '0/0',
                    type: 'p2sh-2-of-3',
                    publicKeys: [
                        '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
                        '03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0',
                        '023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772'
                    ],
                    redeem: '522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae'
                }
            ]);
        });
    });

    it('should', () => {

    });
    it('should', () => {

    });
    it('should', () => {

    });
    it('should', () => {

    });

});
