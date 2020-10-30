import { convertExtendedKey } from './convert';
import { equal } from 'assert';

describe('convertExtKey', () => {
    const tpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B';
    const upub = 'upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa';
    const Upub = 'Upub5JQfBberxLXY7TucyCJwQqKkDXK1NufbQjNPjksFstLgYBWMgwep3ngwqqKzsVbhdZmT8p9991PmKa5Aj9zxySX8ZJA8PSYkpXJQ8LykvyK';
    const vpub = 'vpub5SLqN2bLY4WeYBwMrtdanr5SfhRC7AyW1aEwbtVbt7t9y6kgBCS6ajVA4LL7Jy2iojpH1hjaiTMp5h4y9dG2dC64bAk9ZwuFCX6AvxFddaa';
    const Vpub = 'Vpub5dEvVGKn7251xm6joZ6ZcvRFPVTTKXf6KqtcX9m9FtiZbHKawbpNfrM5s3HasQFd3CtFtHjhbfkKCrgjSrQymgCjRdrYyMNF6FN3Wy9M59B';

    it('should convert correctly to tpub => tpub (identity)', () => {
        equal(convertExtendedKey({ extKey: tpub, targetFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to tpub => upub', () => {
        equal(convertExtendedKey({ extKey: tpub, targetFormat: 'upub' }), upub);
    });
    it('should convert correctly to tpub => Upub', () => {
        equal(convertExtendedKey({ extKey: tpub, targetFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to tpub => vpub', () => {
        equal(convertExtendedKey({ extKey: tpub, targetFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to tpub => Vpub', () => {
        equal(convertExtendedKey({ extKey: tpub, targetFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to upub => upub (identity)', () => {
        equal(convertExtendedKey({ extKey: upub, targetFormat: 'upub' }), upub);
    });
    it('should convert correctly to upub => tpub', () => {
        equal(convertExtendedKey({ extKey: upub, targetFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to upub => Upub', () => {
        equal(convertExtendedKey({ extKey: upub, targetFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to upub => vpub', () => {
        equal(convertExtendedKey({ extKey: upub, targetFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to upub => Vpub', () => {
        equal(convertExtendedKey({ extKey: upub, targetFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to Upub => Upub (identity)', () => {
        equal(convertExtendedKey({ extKey: Upub, targetFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to Upub => tpub', () => {
        equal(convertExtendedKey({ extKey: Upub, targetFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to Upub => upub', () => {
        equal(convertExtendedKey({ extKey: Upub, targetFormat: 'upub' }), upub);
    });
    it('should convert correctly to Upub => vpub', () => {
        equal(convertExtendedKey({ extKey: Upub, targetFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to Upub => Vpub', () => {
        equal(convertExtendedKey({ extKey: Upub, targetFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to vpub => vpub (identity)', () => {
        equal(convertExtendedKey({ extKey: vpub, targetFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to vpub => tpub', () => {
        equal(convertExtendedKey({ extKey: vpub, targetFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to vpub => upub', () => {
        equal(convertExtendedKey({ extKey: vpub, targetFormat: 'upub' }), upub);
    });
    it('should convert correctly to vpub => Upub', () => {
        equal(convertExtendedKey({ extKey: vpub, targetFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to vpub => Vpub', () => {
        equal(convertExtendedKey({ extKey: vpub, targetFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to Vpub => Vpub (identity)', () => {
        equal(convertExtendedKey({ extKey: Vpub, targetFormat: 'Vpub' }), Vpub);
    });
    it('should convert correctly to Vpub => tpub', () => {
        equal(convertExtendedKey({ extKey: Vpub, targetFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to Vpub => upub', () => {
        equal(convertExtendedKey({ extKey: Vpub, targetFormat: 'upub' }), upub);
    });
    it('should convert correctly to Vpub => Upub', () => {
        equal(convertExtendedKey({ extKey: Vpub, targetFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to Vpub => vpub', () => {
        equal(convertExtendedKey({ extKey: Vpub, targetFormat: 'vpub' }), vpub);
    });
});