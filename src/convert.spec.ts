import { convert } from './convert';
import { strictEqual } from 'assert';

describe('convert', () => {
    const tpub = 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B';
    const upub = 'upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa';
    const Upub = 'Upub5JQfBberxLXY7TucyCJwQqKkDXK1NufbQjNPjksFstLgYBWMgwep3ngwqqKzsVbhdZmT8p9991PmKa5Aj9zxySX8ZJA8PSYkpXJQ8LykvyK';
    const vpub = 'vpub5SLqN2bLY4WeYBwMrtdanr5SfhRC7AyW1aEwbtVbt7t9y6kgBCS6ajVA4LL7Jy2iojpH1hjaiTMp5h4y9dG2dC64bAk9ZwuFCX6AvxFddaa';
    const Vpub = 'Vpub5dEvVGKn7251xm6joZ6ZcvRFPVTTKXf6KqtcX9m9FtiZbHKawbpNfrM5s3HasQFd3CtFtHjhbfkKCrgjSrQymgCjRdrYyMNF6FN3Wy9M59B';

    it('should convert correctly tpub => tpub (identity)', () => {
        strictEqual(convert({ extKey: tpub, targetFormat: 'tpub' }), tpub);
    });
    it('should convert correctly tpub => upub', () => {
        strictEqual(convert({ extKey: tpub, targetFormat: 'upub' }), upub);
    });
    it('should convert correctly tpub => Upub', () => {
        strictEqual(convert({ extKey: tpub, targetFormat: 'Upub' }), Upub);
    });
    it('should convert correctly tpub => vpub', () => {
        strictEqual(convert({ extKey: tpub, targetFormat: 'vpub' }), vpub);
    });
    it('should convert correctly tpub => Vpub', () => {
        strictEqual(convert({ extKey: tpub, targetFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly upub => upub (identity)', () => {
        strictEqual(convert({ extKey: upub, targetFormat: 'upub' }), upub);
    });
    it('should convert correctly upub => tpub', () => {
        strictEqual(convert({ extKey: upub, targetFormat: 'tpub' }), tpub);
    });
    it('should convert correctly upub => Upub', () => {
        strictEqual(convert({ extKey: upub, targetFormat: 'Upub' }), Upub);
    });
    it('should convert correctly upub => vpub', () => {
        strictEqual(convert({ extKey: upub, targetFormat: 'vpub' }), vpub);
    });
    it('should convert correctly upub => Vpub', () => {
        strictEqual(convert({ extKey: upub, targetFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly Upub => Upub (identity)', () => {
        strictEqual(convert({ extKey: Upub, targetFormat: 'Upub' }), Upub);
    });
    it('should convert correctly Upub => tpub', () => {
        strictEqual(convert({ extKey: Upub, targetFormat: 'tpub' }), tpub);
    });
    it('should convert correctly Upub => upub', () => {
        strictEqual(convert({ extKey: Upub, targetFormat: 'upub' }), upub);
    });
    it('should convert correctly Upub => vpub', () => {
        strictEqual(convert({ extKey: Upub, targetFormat: 'vpub' }), vpub);
    });
    it('should convert correctly Upub => Vpub', () => {
        strictEqual(convert({ extKey: Upub, targetFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly vpub => vpub (identity)', () => {
        strictEqual(convert({ extKey: vpub, targetFormat: 'vpub' }), vpub);
    });
    it('should convert correctly vpub => tpub', () => {
        strictEqual(convert({ extKey: vpub, targetFormat: 'tpub' }), tpub);
    });
    it('should convert correctly vpub => upub', () => {
        strictEqual(convert({ extKey: vpub, targetFormat: 'upub' }), upub);
    });
    it('should convert correctly vpub => Upub', () => {
        strictEqual(convert({ extKey: vpub, targetFormat: 'Upub' }), Upub);
    });
    it('should convert correctly vpub => Vpub', () => {
        strictEqual(convert({ extKey: vpub, targetFormat: 'Vpub' }), Vpub);
    });

    it('should convert correctly Vpub => Vpub (identity)', () => {
        strictEqual(convert({ extKey: Vpub, targetFormat: 'Vpub' }), Vpub);
    });
    it('should convert correctly Vpub => tpub', () => {
        strictEqual(convert({ extKey: Vpub, targetFormat: 'tpub' }), tpub);
    });
    it('should convert correctly Vpub => upub', () => {
        strictEqual(convert({ extKey: Vpub, targetFormat: 'upub' }), upub);
    });
    it('should convert correctly Vpub => Upub', () => {
        strictEqual(convert({ extKey: Vpub, targetFormat: 'Upub' }), Upub);
    });
    it('should convert correctly Vpub => vpub', () => {
        strictEqual(convert({ extKey: Vpub, targetFormat: 'vpub' }), vpub);
    });

    it('should convert WIF to private key', () => {
        const wif = '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ';
        const privKey = '0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d';
        strictEqual(convert({ wif }), privKey);
    });
});