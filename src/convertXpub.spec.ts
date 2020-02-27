import { convertExtendedKey } from './convertXpub';
import { equal } from 'assert';

describe('convertXpub', () => {
    const tpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B';
    const upub = 'upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa';
    const Upub = 'Upub5JQfBberxLXY7TucyCJwQqKkDXK1NufbQjNPjksFstLgYBWMgwep3ngwqqKzsVbhdZmT8p9991PmKa5Aj9zxySX8ZJA8PSYkpXJQ8LykvyK';
    const vpub = 'vpub5SLqN2bLY4WeYBwMrtdanr5SfhRC7AyW1aEwbtVbt7t9y6kgBCS6ajVA4LL7Jy2iojpH1hjaiTMp5h4y9dG2dC64bAk9ZwuFCX6AvxFddaa';
    const Vpub = 'Vpub5dEvVGKn7251xm6joZ6ZcvRFPVTTKXf6KqtcX9m9FtiZbHKawbpNfrM5s3HasQFd3CtFtHjhbfkKCrgjSrQymgCjRdrYyMNF6FN3Wy9M59B';

    it('should convert correctly to tpub => tpub (identity)', () => {
        equal(convertExtendedKey({ extKey: tpub, toFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to tpub => upub', () => {
        equal(convertExtendedKey({ extKey: tpub, toFormat: 'upub' }), upub);
    });
    it('should convert correctly to tpub => Upub', () => {
        equal(convertExtendedKey({ extKey: tpub, toFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to tpub => vpub', () => {
        equal(convertExtendedKey({ extKey: tpub, toFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to tpub => Vpub', () => {
        equal(convertExtendedKey({ extKey: tpub, toFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to upub => upub (identity)', () => {
        equal(convertExtendedKey({ extKey: upub, toFormat: 'upub' }), upub);
    });
    it('should convert correctly to upub => tpub', () => {
        equal(convertExtendedKey({ extKey: upub, toFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to upub => Upub', () => {
        equal(convertExtendedKey({ extKey: upub, toFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to upub => vpub', () => {
        equal(convertExtendedKey({ extKey: upub, toFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to upub => Vpub', () => {
        equal(convertExtendedKey({ extKey: upub, toFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to Upub => Upub (identity)', () => {
        equal(convertExtendedKey({ extKey: Upub, toFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to Upub => tpub', () => {
        equal(convertExtendedKey({ extKey: Upub, toFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to Upub => upub', () => {
        equal(convertExtendedKey({ extKey: Upub, toFormat: 'upub' }), upub);
    });
    it('should convert correctly to Upub => vpub', () => {
        equal(convertExtendedKey({ extKey: Upub, toFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to Upub => Vpub', () => {
        equal(convertExtendedKey({ extKey: Upub, toFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to vpub => vpub (identity)', () => {
        equal(convertExtendedKey({ extKey: vpub, toFormat: 'vpub' }), vpub);
    });
    it('should convert correctly to vpub => tpub', () => {
        equal(convertExtendedKey({ extKey: vpub, toFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to vpub => upub', () => {
        equal(convertExtendedKey({ extKey: vpub, toFormat: 'upub' }), upub);
    });
    it('should convert correctly to vpub => Upub', () => {
        equal(convertExtendedKey({ extKey: vpub, toFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to vpub => Vpub', () => {
        equal(convertExtendedKey({ extKey: vpub, toFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly to Vpub => Vpub (identity)', () => {
        equal(convertExtendedKey({ extKey: Vpub, toFormat: 'Vpub' }), Vpub);
    });
    it('should convert correctly to Vpub => tpub', () => {
        equal(convertExtendedKey({ extKey: Vpub, toFormat: 'tpub' }), tpub);
    });
    it('should convert correctly to Vpub => upub', () => {
        equal(convertExtendedKey({ extKey: Vpub, toFormat: 'upub' }), upub);
    });
    it('should convert correctly to Vpub => Upub', () => {
        equal(convertExtendedKey({ extKey: Vpub, toFormat: 'Upub' }), Upub);
    });
    it('should convert correctly to Vpub => vpub', () => {
        equal(convertExtendedKey({ extKey: Vpub, toFormat: 'vpub' }), vpub);
    });
});