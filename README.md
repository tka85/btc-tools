# btc-utils

Small self-contained, bitcoin utils. Now with support for litecoin. Support both mainnet and testnet for both coins.

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

Derives addresses and other related data given:
  * ext key (pub or prv)
  * network and
  * optionally path

All following examples evaluate root + 2 derived addresses for several different paths.

### Usage on cli

```bash
$ node dist/src/derive --help
```

#### No path

```bash
$ node dist/src/derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m/" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
```

all have same output:

```
┌─────────┬───────┬──────────────────────────────────────┬───────────────────────────────────────┬──────────────────────────────────────────────┬───────┐
│ (index) │ path  │                legacy                │              p2sh_p2wpkh              │                    bech32                    │ depth │
├─────────┼───────┼──────────────────────────────────────┼───────────────────────────────────────┼──────────────────────────────────────────────┼───────┤
│    0    │ 'm/'  │ 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud' │ '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY' │ 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4' │   0   │
│    1    │ 'm/0' │ 'myMFMZLu351CMa8ojwGC9Sdm9iwfBSX7rY' │ '2MvieFaH4Ltd2S4rWRqMXUHUMYQz44SEDb3' │ 'tb1qcww93pevcs7uv5jjype6y9j0pf9x63vvu2sklz' │   1   │
│    2    │ 'm/1' │ 'mxsVHeGQbMSWvCFownJYB8r5NYKcFb3iFd' │ '2Msd2vkLY9uavVkmYh2iveHcU32TvomULKy' │ 'tb1qhew9gshgladxm65ye9afcw2z6689w5zc4vs5d6' │   1   │
└─────────┴───────┴──────────────────────────────────────┴───────────────────────────────────────┴──────────────────────────────────────────────┴───────┘
```

#### Path 0

```bash
$ node dist/src/derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "/0/" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "0/" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m/0/" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
```

all have same output:

```
┌─────────┬─────────┬──────────────────────────────────────┬───────────────────────────────────────┬──────────────────────────────────────────────┬───────┐
│ (index) │  path   │                legacy                │              p2sh_p2wpkh              │                    bech32                    │ depth │
├─────────┼─────────┼──────────────────────────────────────┼───────────────────────────────────────┼──────────────────────────────────────────────┼───────┤
│    0    │  'm/'   │ 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud' │ '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY' │ 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4' │   0   │
│    1    │ 'm/0/0' │ 'n1LKejAadN6hg2FrBXoU1KrwX4uK16mco9' │ '2N2gQKzjUe47gM8p1JZxaAkTcoHPXV6YyVp' │ 'tb1qm90ugl4d48jv8n6e5t9ln6t9zlpm5th690vysp' │   2   │
│    2    │ 'm/0/1' │ 'n4p1QRcGpe6QVKnigjD89y9bHNC8fgCQVt' │ '2MwYugt7aSWdcN48UnoNctMt1curUvhwySE' │ 'tb1ql7zg7ukh3dwr25ex2zn9jse926f27xy2std2uj' │   2   │
└─────────┴─────────┴──────────────────────────────────────┴───────────────────────────────────────┴──────────────────────────────────────────────┴───────┘
```

#### Hardened path

Note: path containing hardened component, requires extended private key for `-x`.
Hardened components in path string are denoted by prime `"<number>'"` or by `"<number>h"`.

```bash
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "m/0'" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "m/0h" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "/0'" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "/0h" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "0'" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "0h" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
```

all have same output:

```
┌─────────┬───────────┬──────────────────────────────────────┬───────────────────────────────────────┬──────────────────────────────────────────────┬───────┐
│ (index) │   path    │                legacy                │              p2sh_p2wpkh              │                    bech32                    │ depth │
├─────────┼───────────┼──────────────────────────────────────┼───────────────────────────────────────┼──────────────────────────────────────────────┼───────┤
│    0    │   'm/'    │ 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud' │ '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY' │ 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4' │   0   │
│    1    │ "m/0\'/0" │ 'n3NkSZqoPMCQN5FENxUBw4qVATbytH6FDK' │ '2NA9LWMy8Bn5QTs5CB5Z8Fbqm66oDbp8KL4' │ 'tb1qalzchqutx9f3wjln69nhkusnx5aymn8a5tyk9c' │   2   │
│    2    │ "m/0\'/1" │ 'n4Bii59dRNEVqvqkCT61Ruw9hQJYyckAQB' │ '2N7B3X9gJviqZ4uys55EGmNEhcgkRaguLKK' │ 'tb1qlzn6vxfhgkg2ph7mglggexg0ur7u2fdzhw6aen' │   2   │
└─────────┴───────────┴──────────────────────────────────────┴───────────────────────────────────────┴──────────────────────────────────────────────┴───────┘
```

#### Hardened children

Note: path containing hardened component, requires extended private key for `-x`.
To request that the derived children are also hardened, use `-H`.


```bash
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "m/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "m/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
$ node dist/src/derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
```

all have same output (notice how final component of path is hardened):

```
┌─────────┬──────────┬──────────────────────────────────────┬───────────────────────────────────────┬──────────────────────────────────────────────┬───────┐
│ (index) │   path   │                legacy                │              p2sh_p2wpkh              │                    bech32                    │ depth │
├─────────┼──────────┼──────────────────────────────────────┼───────────────────────────────────────┼──────────────────────────────────────────────┼───────┤
│    0    │   'm/'   │ 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud' │ '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY' │ 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4' │   0   │
│    1    │ "m/0/0'" │ 'mjrWfLF9MemTz6jL4yuWZ3qWuA9thoUZMe' │ '2N6aBpWwCaUovasCfWJmnNLVpBh6D9ChBUW' │ 'tb1q97fke3clxkzr5hr8hq7yadd7ljs3lchehh0kv0' │   2   │
│    2    │ "m/0/1'" │ 'mmtstCibBCgczNPnpLtgXUbn8UYygK6Q6C' │ '2MwcZakRVPpowePNXUvEEmJjQLkjFZAAZwn' │ 'tb1qghmrjwhysp8dfmdswzfhzp2vnmg8pz9wzwl64l' │   2   │
└─────────┴──────────┴──────────────────────────────────────┴───────────────────────────────────────┴──────────────────────────────────────────────┴───────┘
```


### Usage as module

```javascript
import { derive } from './src/derive';

derive({
  extKey: 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B',
  path: 'm/',
  cols: 'path,legacy,p2sh_p2wpkh,bech32,depth',
  includeRoot: true,
  count: 2,
  networkName: 'btctest'});
// [
//   {
//     path: 'm/',
//     legacy: 'mgeNvuFj7FD6MzAYNzdUB7HpUWezFjvuud',
//     p2sh_p2wpkh: '2MwGQiqSYMXwzzgorZi5V4oBJpC7AA6jsPY',
//     bech32: 'tb1qp30e58hrp0etgsl2q9y4tar26a93nwc0wa0zh4',
//     depth: 0
//   },
//   {
//     path: 'm/0',
//     legacy: 'myMFMZLu351CMa8ojwGC9Sdm9iwfBSX7rY',
//     p2sh_p2wpkh: '2MvieFaH4Ltd2S4rWRqMXUHUMYQz44SEDb3',
//     bech32: 'tb1qcww93pevcs7uv5jjype6y9j0pf9x63vvu2sklz',
//     depth: 1
//   },
//   {
//     path: 'm/1',
//     legacy: 'mxsVHeGQbMSWvCFownJYB8r5NYKcFb3iFd',
//     p2sh_p2wpkh: '2Msd2vkLY9uavVkmYh2iveHcU32TvomULKy',
//     bech32: 'tb1qhew9gshgladxm65ye9afcw2z6689w5zc4vs5d6',
//     depth: 1
//   }
// ]
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
$ node dist/src/convertXpub -x upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa -t tpub
tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B
```

#### Convert from tpub to upub

```bash
$ node dist/src/convertXpub -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -t upub
upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa
```

### Usage as module

```javascript
import { convertExtendedKey } from './src/convertXpub';

convertExtendedKey({ extKey: 'upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa', targetFormat: 'tpub' }); // tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B`
```

## Util: 'generate'

Generates random:

  * random bip39 24-word mnemonic in any one of 6 different languages (english, spanis, french, italian, japanese, korean)
  * random bip32 seed
  * random ext prv and pub keys (format: 'xprv', 'xpub', 'yprv', 'ypub', 'Yprv', 'Ypub', 'zprv', 'zpub', 'Zprv', 'Zpub', 'tprv', 'tpub', 'uprv', 'upub', 'Uprv', 'Upub', 'vprv', 'vpub', 'Vprv', 'Vpub')
  * random priv/pub key pair

### Usage on cli

```bash
$ node dist/src/generate --help
```

#### Generate a bip39 mnemonic

```bash
$ node dist/src/generate -m en
inspire symptom sadness voice leaf slam worry cricket wave cube meat evoke vintage oval true tortoise stone airport duck cart caught ladder spy affair
```

#### Generate a bip32 seed

```bash
$ node dist/src/generate -s
2b9912a3b1f16ed40ac481b4a7c58a2e85a4da63f7399aace1b76b89f91b14b6765ba66a318e7475b5b0cbfc31d2518e4ad9be0dda00bf0d0b1196aa3c9539a2
```

#### Generate an extended key

```bash
$ node dist/src/generate -x xprv
xprv9s21ZrQH143K3PZLGMhS94yDTHvsukf29k47mjvcCuMhaNDwPcRB9wPm1wDit7scpH2QpEdvsoTt4eZVaeZMBZFkLfddNypDKWSygBqkVKQ
$ node dist/src/generate -x tpub
tpubD6NzVbkrYhZ4YerTmAcxhz2b7DsvGgNRqbH2YQRamzMi24nK7fJQy5vo6iGRivRxv6xV7fJQRUV6v6YahvHK6Q2fJMB5hMWGoSATNnv18Lm
```

#### Generate a priv/pub key pair

```bash
$ node dist/src/generate -p testnet
┌───────────┬──────────────────────────────────────────────────────────────────────┐
│  (index)  │                                Values                                │
├───────────┼──────────────────────────────────────────────────────────────────────┤
│    wif    │        'cUAjfPW8hpMWoqoAiBdY9tXEQ2wYfbTdUV7MGZUTEkeqsgft4QTJ'        │
│  privKey  │  'c4887b4c9002431d06abc1826c1a3664468fe69a1111ae3834cf5ed0bf149ae4'  │
│ publicKey │ '027a8e6e49f63bcd9013d1ad79674d099b17476d0ba664f6a5419abe5931c3e17c' │
└───────────┴──────────────────────────────────────────────────────────────────────┘
$ node dist/src/generate -p mainnet
┌───────────┬──────────────────────────────────────────────────────────────────────┐
│  (index)  │                                Values                                │
├───────────┼──────────────────────────────────────────────────────────────────────┤
│    wif    │        'L4XGX27a5nXEWafq9E3e4e35nZ6eqsutNuT1FE2omnmPnXgEXwga'        │
│  privKey  │  'd9e4ddc0f9cff802f9b1c610f800f133037f14bf1f62dfd640226852360d2197'  │
│ publicKey │ '03e4163a5335e07f190d4f38e0ed6e4512b4be4a98b7ded15f74925377f66e7a59' │
└───────────┴──────────────────────────────────────────────────────────────────────┘
```

### Usage as module

```javascript
import { generateMnemonic, generateSeed, generateExtKey, generateKeyPair } from './src/generate';

generateMnemonic({}); // 'frequent sudden grape provide become dutch series zebra village word rain rapid powder prefer actor sport young cactus swear pony mammal naive curve execute'
generateMnemonic({lang: 'jp'}); // くげÿん ざÿいたく くるま いそがÿしい よしゅう みやげÿ れんぞÿく ほあん はけん ことし けおとす げÿつれい きどÿう つたえる めぐÿまれる しいん ふうせん みなと ないしょ うぶÿごÿえ すんぜÿん はしごÿ おうたい すける
generateSeed(); // '1614878403da35d2168336a98531028f013103951baf2bedff01aa2a0bd862240233582c5df9467e639dfb0ca24df51acbc8132c3f4a4b93e0789c00c9608a31'
generateExtKey({extKeyType: 'xpub'}); // xpub661MyMwAqRbcGidYzhKCcBC1DMLx63zEYR5RpXRcY7Pn1zg32M1KZmhCDzgFz8xyxjV8sMqiAuj2QnzJG3T7YYFyMa2fcfcbNqRQ6vKqwHc
generateExtKey({extKeyType: 'tprv'}); // tprv8ZgxMBicQKsPeQVsuJ4r6oekXyT377JTjignxfP9KyufPh9Nr1h6QTZ893AEQXUXzZPyBiMVsaanVyNcDebFtsH3XjVFJDQnh8uN6ug8Bo7
generateKeyPair({network: 'mainnet'}); // { wif: 'KzCtsnCsivj1g5atA9TMLtLYssN18XBgxYuv1srrKWYFz9VCrxmK', privKey: '5917b39187ad5dbd2cfe5137e6aa6dc5bd28b67b651b6b72df2ba2d78a882106', publicKey: '039669a78ff2487e02604b0be6c9d9b5cc7ecd4dfa770f68e40b30e187fbcd110c' }
```

## Util: 'multisig'

TBD