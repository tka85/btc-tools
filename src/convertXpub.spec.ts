import { convertExtendedKey } from './convertXpub';
import { equal } from 'assert';

describe('convertXpub', () => {
    const tpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B';
    const upub = 'upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa';
    const Upub = 'Upub5JQfBberxLXY7TucyCJwQqKkDXK1NufbQjNPjksFstLgYBWMgwep3ngwqqKzsVbhdZmT8p9991PmKa5Aj9zxySX8ZJA8PSYkpXJQ8LykvyK';
    const vpub = 'vpub5SLqN2bLY4WeYBwMrtdanr5SfhRC7AyW1aEwbtVbt7t9y6kgBCS6ajVA4LL7Jy2iojpH1hjaiTMp5h4y9dG2dC64bAk9ZwuFCX6AvxFddaa';
    const Vpub = 'Vpub5dEvVGKn7251xm6joZ6ZcvRFPVTTKXf6KqtcX9m9FtiZbHKawbpNfrM5s3HasQFd3CtFtHjhbfkKCrgjSrQymgCjRdrYyMNF6FN3Wy9M59B';

    it('should convert correctly to tpub => tpub (identity)', () => {
        equal(convertExtendedKey({ sourceKey: tpub, destFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to tpub => upub', () => {
        equal(convertExtendedKey({ sourceKey: tpub, destFormat: 'upub' }), upub);
    });
    it('should convert correctly to tpub => Upub', () => {
        equal(convertExtendedKey({ sourceKey: tpub, destFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to tpub => vpub', () => {
        equal(convertExtendedKey({ sourceKey: tpub, destFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to tpub => Vpub', () => {
        equal(convertExtendedKey({ sourceKey: tpub, destFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to upub => upub (identity)', () => {
        equal(convertExtendedKey({ sourceKey: upub, destFormat: 'upub' }), upub);
    });
    it('should convert correctly to upub => tpub', () => {
        equal(convertExtendedKey({ sourceKey: upub, destFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to upub => Upub', () => {
        equal(convertExtendedKey({ sourceKey: upub, destFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to upub => vpub', () => {
        equal(convertExtendedKey({ sourceKey: upub, destFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to upub => Vpub', () => {
        equal(convertExtendedKey({ sourceKey: upub, destFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to Upub => Upub (identity)', () => {
        equal(convertExtendedKey({ sourceKey: Upub, destFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to Upub => tpub', () => {
        equal(convertExtendedKey({ sourceKey: Upub, destFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to Upub => upub', () => {
        equal(convertExtendedKey({ sourceKey: Upub, destFormat: 'upub' }), upub);
    });
    it('should convert correctly to Upub => vpub', () => {
        equal(convertExtendedKey({ sourceKey: Upub, destFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to Upub => Vpub', () => {
        equal(convertExtendedKey({ sourceKey: Upub, destFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to vpub => vpub (identity)', () => {
        equal(convertExtendedKey({ sourceKey: vpub, destFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to vpub => tpub', () => {
        equal(convertExtendedKey({ sourceKey: vpub, destFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to vpub => upub', () => {
        equal(convertExtendedKey({ sourceKey: vpub, destFormat: 'upub' }), upub);
    });
    it('should convert correctly to vpub => Upub', () => {
        equal(convertExtendedKey({ sourceKey: vpub, destFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to vpub => Vpub', () => {
        equal(convertExtendedKey({ sourceKey: vpub, destFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to Vpub => Vpub (identity)', () => {
        equal(convertExtendedKey({ sourceKey: Vpub, destFormat: 'Vpub' }), Vpub);
    });
    it('should convert correctly to Vpub => tpub', () => {
        equal(convertExtendedKey({ sourceKey: Vpub, destFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to Vpub => upub', () => {
        equal(convertExtendedKey({ sourceKey: Vpub, destFormat: 'upub' }), upub);
    });
    it('should convert correctly to Vpub => Upub', () => {
        equal(convertExtendedKey({ sourceKey: Vpub, destFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to Vpub => vpub', () => {
        equal(convertExtendedKey({ sourceKey: Vpub, destFormat: 'vpub' }), vpub);
    });
});