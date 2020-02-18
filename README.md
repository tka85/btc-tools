# btc-utils

Small self-contained, bitcoin utils.

Each util can be used:
  * on command line as standalone script
  * as a module

## Build

```bash
$ npm i
```

This will install all dependencies and build from the Typescript the corersponding JavaScript under `dist/`.

All utils reside under `dist/src/*`

## Usage options

To see the command line options of a script, after building do for example for `derive`:

```bash
$ node dist/src/derive --help
```

## Util: 'derive'

Derives addresses et al. given:
  * ext key (pub or priv)
  * path and
  * network

All following examples evaluate root + 2 derived addresses for several different paths.

### Usage on cli

```bash
$ node dist/src/derive --help
```

##### Path m/0

```bash
$ node dist/src/derive -n testnet -k tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "" -C path,legacy,p2sh_segwit,bech32,depth -R -c 2
$ node dist/src/derive -n testnet -k tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m" -C path,legacy,p2sh_segwit,bech32,depth -R -c 2
$ node dist/src/derive -n testnet -k tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m/" -C path,legacy,p2sh_segwit,bech32,depth -R -c 2
```

all have same output:

```
┌─────────┬───────┬──────────────────────────────────────┬───────────────────────────────────────┬──────────────────────────────────────────────┬───────┐
│ (index) │ path  │                legacy                │              p2sh_segwit              │                    bech32                    │ depth │
├─────────┼───────┼──────────────────────────────────────┼───────────────────────────────────────┼──────────────────────────────────────────────┼───────┤
│    0    │ 'm/'  │ 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud' │ '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY' │ 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4' │   0   │
│    1    │ 'm/0' │ 'myMFMZLu351CMa8ojwGC9Sdm9iwfBSX7rY' │ '2MvieFaH4Ltd2S4rWRqMXUHUMYQz44SEDb3' │ 'tb1qcww93pevcs7uv5jjype6y9j0pf9x63vvu2sklz' │   1   │
│    2    │ 'm/1' │ 'mxsVHeGQbMSWvCFownJYB8r5NYKcFb3iFd' │ '2Msd2vkLY9uavVkmYh2iveHcU32TvomULKy' │ 'tb1qhew9gshgladxm65ye9afcw2z6689w5zc4vs5d6' │   1   │
└─────────┴───────┴──────────────────────────────────────┴───────────────────────────────────────┴──────────────────────────────────────────────┴───────┘
```

##### Path m/0/0

```bash
$ node dist/src/derive -n testnet -k tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "0" -C path,legacy,p2sh_segwit,bech32,depth -R -c 2
$ node dist/src/derive -n testnet -k tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "0/" -C path,legacy,p2sh_segwit,bech32,depth -R -c 2
$ node dist/src/derive -n testnet -k tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m/0" -C path,legacy,p2sh_segwit,bech32,depth -R -c 2
```

all have same output:

```
┌─────────┬─────────┬──────────────────────────────────────┬───────────────────────────────────────┬──────────────────────────────────────────────┬───────┐
│ (index) │  path   │                legacy                │              p2sh_segwit              │                    bech32                    │ depth │
├─────────┼─────────┼──────────────────────────────────────┼───────────────────────────────────────┼──────────────────────────────────────────────┼───────┤
│    0    │  'm/'   │ 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud' │ '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY' │ 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4' │   0   │
│    1    │ 'm/0/0' │ 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9' │ '2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp' │ 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp' │   2   │
│    2    │ 'm/0/1' │ 'n4p1QRcGpe6QVKnigjD89y9bHNC8fgCQVt' │ '2MwYugt7aSWdcN48UnoNctMt1curUvhwySE' │ 'tb1ql7zg7ukh3dwr25ex2zn9jse926f27xy2std2uj' │   2   │
└─────────┴─────────┴──────────────────────────────────────┴───────────────────────────────────────┴──────────────────────────────────────────────┴───────┘
```

##### Path m/0/0

```bash
$ node dist/src/derive -n testnet -k tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m/0/0" -C path,legacy,p2sh_segwit,bech32,depth -R -c 2
$ node dist/src/derive -n testnet -k tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "0/0" -C path,legacy,p2sh_segwit,bech32,depth -R -c 2
```

both have same output:

```
┌─────────┬───────────┬──────────────────────────────────────┬───────────────────────────────────────┬──────────────────────────────────────────────┬───────┐
│ (index) │   path    │                legacy                │              p2sh_segwit              │                    bech32                    │ depth │
├─────────┼───────────┼──────────────────────────────────────┼───────────────────────────────────────┼──────────────────────────────────────────────┼───────┤
│    0    │   'm/'    │ 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud' │ '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY' │ 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4' │   0   │
│    1    │ 'm/0/0/0' │ 'ms1hxHdjepJi2iXVHWEXMr1CArP6KUT4iL' │ '2NCXZfXaJeRc4YwXYQTdk2hoMjo6voDa36k' │ 'tb1q0cvhndxl26g6jlamxfa2mge9rgtv5wvvfqyxau' │   3   │
│    2    │ 'm/0/0/1' │ 'mkBjJ7L9Ssx5JL2g7pLvnqckZjaxi1YbG4' │ '2N1XnWGBp4PhWhJYDELrLHU8N6dx7S4LyUQ' │ 'tb1qxv6alevdx8v6ly9lvnkj2tjpc59t58zrnk0x4h' │   3   │
└─────────┴───────────┴──────────────────────────────────────┴───────────────────────────────────────┴──────────────────────────────────────────────┴───────┘
```

### Usage as module

```javascript
import derive from './src/derive';

const derivedData = derive({
    key: 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B',
    path: '',
    cols: 'path,legacy,p2sh_segwit,bech32,depth',
    network: 'testnet',
    includeRoot: true,
    count: 2,
    printStdout: false
});
```

where `derivedData` is:

```javascript
[
  {
    path: 'm/',
    legacy: 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud',
    p2sh_segwit: '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY',
    bech32: 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4',
    depth: 0
  },
  {
    path: 'm/0',
    legacy: 'myMFMZLu351CMa8ojwGC9Sdm9iwfBSX7rY',
    p2sh_segwit: '2MvieFaH4Ltd2S4rWRqMXUHUMYQz44SEDb3',
    bech32: 'tb1qcww93pevcs7uv5jjype6y9j0pf9x63vvu2sklz',
    depth: 1
  },
  {
    path: 'm/1',
    legacy: 'mxsVHeGQbMSWvCFownJYB8r5NYKcFb3iFd',
    p2sh_segwit: '2Msd2vkLY9uavVkmYh2iveHcU32TvomULKy',
    bech32: 'tb1qhew9gshgladxm65ye9afcw2z6689w5zc4vs5d6',
    depth: 1
  }
]
```

## Util: 'convertXpub'

Convert from one type of extended key to another. Despite the name it applies to extended private and public keys.

Meaningful conversions between any two of same group:

  * mainnet xprv: ['xprv', 'yprv', 'Yprv', 'zprv', 'Zprv']
  * mainnet xpub: ['xpub', 'ypub', 'Ypub', 'zpub', 'Zpub']
  * testnet xprv: ['tprv', 'uprv', 'Uprv', 'vprv', 'Vprv']
  * testnet xpub: ['tpub', 'upub', 'Upub', 'vpub', 'Vpub']

### Usage on cli

```bash
$ node dist/src/convertXpub --help
```

#### Convert from upub to tpub

```bash
$ node dist/src/convertXpub -s upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa -d tpub
tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B
```

#### Convert from tpub to upub

```bash
$ node dist/src/convertXpub -s tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -d upub
upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa
```

### Usage as module

```javascript
import convertExtendedKey from './src/convertXpub';

const convertedExtKey = convertExtendedKey({ sourceKey: 'upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa', destFormat: 'tpub' });
```

where `convertedExtKey` is `tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B`.

## Util: 'generate'

Generates random:

  * random bip39 24-word mnemonic in any one of 6 different languages (english, spanis, french, italian, japanese, korean)
  * random bip32 seed
  * random ext prv and pub keys (format: 'xprv', 'xpub', 'yprv', 'ypub', 'Yprv', 'Ypub', 'zprv', 'zpub', 'Zprv', 'Zpub', 'tprv', 'tpub', 'uprv', 'upub', 'Uprv', 'Upub', 'vprv', 'vpub', 'Vprv', 'Vpub')

### Usage on cli

```bash
$ node dist/src/generate --help
```

#### Generate random bip39 mnemonic

```bash
$ node dist/src/ -m en
inspire symptom sadness voice leaf slam worry cricket wave cube meat evoke vintage oval true tortoise stone airport duck cart caught ladder spy affair
```

#### Generate bip32 seed

```bash
$ node dist/src/generate -s
2b9912a3b1f16ed40ac481b4a7c58a2e85a4da63f7399aace1b76b89f91b14b6765ba66a318e7475b5b0cbfc31d2518e4ad9be0dda00bf0d0b1196aa3c9539a2
```

#### Generate extended prv key

```bash
$ node dist/src/generate -e xprv
xprv9s21ZrQH143K3PZLGMhS94yDTHvsukf29k47mjvcCuMhaNDwPcRB9wPm1wDit7scpH2QpEdvsoTt4eZVaeZMBZFkLfddNypDKWSygBqkVKQ
```

### Usage as module

```javascript
import { generateMnemonic, generateSeed, generateExtKey } from './src/generate';

const mnemonicEn = generateMnemonic(); // 'frequent sudden grape provide become dutch series zebra village word rain rapid powder prefer actor sport young cactus swear pony mammal naive curve execute'
const mnemonicJp = generateMnemonic('jp'); // くげÿん ざÿいたく くるま いそがÿしい よしゅう みやげÿ れんぞÿく ほあん はけん ことし けおとす げÿつれい きどÿう つたえる めぐÿまれる しいん ふうせん みなと ないしょ うぶÿごÿえ すんぜÿん はしごÿ おうたい すける
const seed = generateSeed(); // '1614878403da35d2168336a98531028f013103951baf2bedff01aa2a0bd862240233582c5df9467e639dfb0ca24df51acbc8132c3f4a4b93e0789c00c9608a31'
const randXPub = generateExtKey('xpub'); // xpub661MyMwAqRbcGidYzhKCcBC1DMLx63zEYR5RpXRcY7Pn1zg32M1KZmhCDzgFz8xyxjV8sMqiAuj2QnzJG3T7YYFyMa2fcfcbNqRQ6vKqwHc
const randTPrv = generateExtKey('tprv'); // tprv8ZgxMBicQKsPeQVsuJ4r6oekXyT377JTjignxfP9KyufPh9Nr1h6QTZ893AEQXUXzZPyBiMVsaanVyNcDebFtsH3XjVFJDQnh8uN6ug8Bo7
```
