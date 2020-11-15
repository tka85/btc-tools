# btc-utils

Collection of utilities for bitcoin and litecoin (both mainnet and testnet for all coins).

Each util can be used:

* on command line as standalone script
* as a module

Command line utils will be symlinked by npm into `prefix/bin` (e.g. `/usr/local/bin` on Ubuntu) for global installs:

```bash
npm i -g btc-utils
```

or `./node_modules/.bin/` for local installs:

```bash
npm i btc-utils
```

Their utils are prefixed with `btc-utils-` like for example `btc-utils-derive` or `btc-utils-generate`. They print their output on stdout and you can choose between table and json format.

## 'derive'

Derives addresses and other related information given:

* ext key (pub or prv)
* network
* path (optional)

All following examples evaluate root + 2 derived addresses for several paths.

### Usage on cli

```bash
btc-utils-derive -h
```

#### No path

```bash
btc-utils-derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m/" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
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
btc-utils-derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "/0/" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "0/" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -p "m/0/" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
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

Note: path containing hardened component, requires extended private key.
Hardened components in path string are denoted by prime `"<number>'"` or by `"<number>h"`.

```bash
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "m/0'" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "m/0h" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "/0'" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "/0h" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "0'" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "0h" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest
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

Note: path containing hardened component, requires extended private key.
To request that the derived children are also hardened, use `-H`.

```bash
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "m/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "m/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "/0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
btc-utils-derive -x tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK -p "0" -C path,legacy,p2sh_p2wpkh,bech32,depth -R -c 2 -N btctest -H
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
const { derive } = require('btc-utils');

derive({
  extKey: 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B',
  path: 'm/',
  cols: 'path,legacy,p2sh_p2wpkh,bech32,depth',
  includeRoot: true,
  count: 2,
  network: 'btctest'});
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

## 'convert'

Utility that does conversions.

It can convert from one type of extended key to another. Despite the name it applies to extended private and as well as extended public keys.

Meaningful conversions between any two of same group:

* mainnet xprv: ['xprv', 'yprv', 'Yprv', 'zprv', 'Zprv']
* mainnet xpub: ['xpub', 'ypub', 'Ypub', 'zpub', 'Zpub']
* testnet xprv: ['tprv', 'uprv', 'Uprv', 'vprv', 'Vprv']
* testnet xpub: ['tpub', 'upub', 'Upub', 'vpub', 'Vpub']

It also converts WIF to privkey buffer and vice versa.

### Usage on cli

```bash
btc-utils-convert -h
```

#### Convert from upub to tpub

```bash
btc-utils-convert -x upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa -t tpub
```

returns `tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B`.

#### Convert from tpub to upub

```bash
btc-utils-convert -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B -t upub
```

returns `upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa`.

### Usage as module

```javascript
const { convert }  = require('btc-utils');

convert({ extKey: 'upub57Wa4MvRPNyAgtkF2XqxakywVjGkAYz16TiipVbiW7WGuzwSvYGXxfq238NXK4NoQ6hUGE92Fo1GCQTQRvr1pxQTiq3iz35kvo2XYU7ZfFa', targetFormat: 'tpub' }); // tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B
```

## 'generate'

Generates random:

* random bip39 24-word mnemonic in any one of 6 different languages (english, spanis, french, italian, japanese, korean)
* random bip32 seed
* random ext prv and pub keys (format: 'xprv', 'xpub', 'yprv', 'ypub', 'Yprv', 'Ypub', 'zprv', 'zpub', 'Zprv', 'Zpub', 'tprv', 'tpub', 'uprv', 'upub', 'Uprv', 'Upub', 'vprv', 'vpub', 'Vprv', 'Vpub')
* random priv/pub key pair

### Usage on cli

```bash
btc-utils-generate -h
```

#### Generate a bip39 mnemonic

```bash
btc-utils-generate -m en
```

returns (example) `inspire symptom sadness voice leaf slam worry cricket wave cube meat evoke vintage oval true tortoise stone airport duck cart caught ladder spy affair`.
#### Generate a bip32 seed

```bash
btc-utils-generate -s
```

returns (example) `2b9912a3b1f16ed40ac481b4a7c58a2e85a4da63f7399aace1b76b89f91b14b6765ba66a318e7475b5b0cbfc31d2518e4ad9be0dda00bf0d0b1196aa3c9539a2`.

#### Generate an extended key

```bash
btc-utils-generate -x xprv
```

returnes (example) `xprv9s21ZrQH143K3PZLGMhS94yDTHvsukf29k47mjvcCuMhaNDwPcRB9wPm1wDit7scpH2QpEdvsoTt4eZVaeZMBZFkLfddNypDKWSygBqkVKQ`.

```bash
btc-utils-generate -x tpub
```

returns (example) `tpubD6NzVbkrYhZ4YerTmAcxhz2b7DsvGgNRqbH2YQRamzMi24nK7fJQy5vo6iGRivRxv6xV7fJQRUV6v6YahvHK6Q2fJMB5hMWGoSATNnv18Lm`.

#### Generate a priv/pub key pair

```bash
btc-utils-generate -k
```

returns (example):

```
┌───────────┬──────────────────────────────────────────────────────────────────────┐
│  (index)  │                                Values                                │
├───────────┼──────────────────────────────────────────────────────────────────────┤
│    wif    │        'cUAjfPW8hpMWoqoAiBdY9tXEQ2wYfbTdUV7MGZUTEkeqsgft4QTJ'        │
│  privKey  │  'c4887b4c9002431d06abc1826c1a3664468fe69a1111ae3834cf5ed0bf149ae4'  │
│  pubKey   │ '027a8e6e49f63bcd9013d1ad79674d099b17476d0ba664f6a5419abe5931c3e17c' │
└───────────┴──────────────────────────────────────────────────────────────────────┘
```

```bash
btc-utils-generate -k
```

returns (example):

```
┌───────────┬──────────────────────────────────────────────────────────────────────┐
│  (index)  │                                Values                                │
├───────────┼──────────────────────────────────────────────────────────────────────┤
│    wif    │        'L4XGX27a5nXEWafq9E3e4e35nZ6eqsutNuT1FE2omnmPnXgEXwga'        │
│  privKey  │  'd9e4ddc0f9cff802f9b1c610f800f133037f14bf1f62dfd640226852360d2197'  │
│  pubKey   │ '03e4163a5335e07f190d4f38e0ed6e4512b4be4a98b7ded15f74925377f66e7a59' │
└───────────┴──────────────────────────────────────────────────────────────────────┘
```

### Usage as module

```javascript
const { generate } = require('btc-utils');

generate({mnemonicLang: 'jp'}); // くげÿん ざÿいたく くるま いそがÿしい よしゅう みやげÿ れんぞÿく ほあん はけん ことし けおとす げÿつれい きどÿう つたえる めぐÿまれる しいん ふうせん みなと ないしょ うぶÿごÿえ すんぜÿん はしごÿ おうたい すける
generate({seed: true}); // '1614878403da35d2168336a98531028f013103951baf2bedff01aa2a0bd862240233582c5df9467e639dfb0ca24df51acbc8132c3f4a4b93e0789c00c9608a31'
generate({extKeyType: 'xpub'}); // xpub661MyMwAqRbcGidYzhKCcBC1DMLx63zEYR5RpXRcY7Pn1zg32M1KZmhCDzgFz8xyxjV8sMqiAuj2QnzJG3T7YYFyMa2fcfcbNqRQ6vKqwHc
generate({extKeyType: 'tprv'}); // tprv8ZgxMBicQKsPeQVsuJ4r6oekXyT377JTjignxfP9KyufPh9Nr1h6QTZ893AEQXUXzZPyBiMVsaanVyNcDebFtsH3XjVFJDQnh8uN6ug8Bo7
generate({keyPair: true}); // { privKey: '5917b39187ad5dbd2cfe5137e6aa6dc5bd28b67b651b6b72df2ba2d78a882106', publicKey: '039669a78ff2487e02604b0be6c9d9b5cc7ecd4dfa770f68e40b30e187fbcd110c' }
```

## 'multisig'

Generates multisig addresses. Can be used in two ways.

* Case 1: given list of N public keys and a threshold M, it returns a single M-of-N multisig address.
* Case 2: Given N extended pub keys (mainnet: 'xpub', 'ypub', 'Ypub', 'zpub', 'Zpub' or testnet: 'tpub', 'upub', 'Upub', 'vpub', 'Vpub'), a threshold M and a derivation path, it returns a list of M-of-N multisig addresses.

**NOTE**: In either case the order of the supplied keys is important.

Supported multisig formats (`--multisig-type, -T` parameter):

* `p2sh` (classical)
* `p2shp2wsh` (wrapped segwit)
* `p2wsh` (native segwit)

### Usage on cli

```bash
btc-utils-multisig -h
```

#### Single multisig address from public keys

```bash
btc-utils-multisig  -T p2sh -P 02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7,03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0,023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772 -t 2 -N btctest -o json
```

will output:

```json
[
  {
    "address": "2N6WamYHLh6KzBaDJeD3NumgdgnSA5qNqW2",
    "type": "p2sh-2-of-3",
    "publicKeys": [
      "02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7",
      "03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0",
      "023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772"
    ],
    "scriptPubKey": "a9149181389b4b877aec7d7557c4300658aa9218a68887",
    "redeem": "522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae",
    "redeemASM": "OP_2 02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7 03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0 023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772 OP_3 OP_CHECKMULTISIG"
  }
]
```

#### Multiple multisig addresses from extended public keys

```bash
btc-utils-multisig  -T p2sh -t 2 -x tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B,tpubD6NzVbkrYhZ4X1MhK22bdUwGstuq9gRABHLoRkm8yUMrS5WJSoo3W13RLbNBzcimJtQiYs8Nc41V9VCKEy5Y793eKK1TvkzSTAxr86wyMuW,tpubD6NzVbkrYhZ4Y3gMUefyddFS1Uob6tMSToYiLLzuWEfCs1KtTFVGZndPxiPaVPtaYebRCsSXdYZ43mWN2LnariYSWnLvLUkyQchghCcTN32 -p 0 -c 1 -N btctest -o json
```

will output:

```json
[
  {
    "address": "2N6WamYHLh6KzBaDJeD3NumgdgnSA5qNqW2",
    "type": "p2sh-2-of-3",
    "publicKeys": [
      "02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7",
      "03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0",
      "023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772"
    ],
    "scriptPubKey": "a9149181389b4b877aec7d7557c4300658aa9218a68887",
    "redeem": "522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae",
    "redeemASM": "OP_2 02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7 03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0 023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772 OP_3 OP_CHECKMULTISIG",
    "path": "0/0"
  }
]
```

### Usage as module

```javascript
const { multisig } = require('btc-utils');

multisig({ multisigType: 'p2sh', threshold: 2, extKeys: 'tpubD6NzVbkrYhZ4WaWSyoBvQwbpLkojyoTZPRsgXELWz3Popb3qkjcJyJUGLnL4qHHoQvao8ESaAstxYSnhyswJ76uZPStJRJCTKvosUCJZL5B,tpubD6NzVbkrYhZ4X1MhK22bdUwGstuq9gRABHLoRkm8yUMrS5WJSoo3W13RLbNBzcimJtQiYs8Nc41V9VCKEy5Y793eKK1TvkzSTAxr86wyMuW,tpubD6NzVbkrYhZ4Y3gMUefyddFS1Uob6tMSToYiLLzuWEfCs1KtTFVGZndPxiPaVPtaYebRCsSXdYZ43mWN2LnariYSWnLvLUkyQchghCcTN32', path: '0', count: 1, network: 'btctest' });
// [
//   {
//     address: '2N6WamYHLh6KzBaDJeD3NumgdgnSA5qNqW2',
//     type: 'p2sh-2-of-3',
//     publicKeys: [
//       '02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7',
//       '03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0',
//       '023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772'
//     ],
//     scriptPubKey: 'a9149181389b4b877aec7d7557c4300658aa9218a68887',
//     redeem: '522102c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c72103db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe021023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c2977253ae',
//     redeemASM: 'OP_2 02c97dc3f4420402e01a113984311bf4a1b8de376cac0bdcfaf1b3ac81f13433c7 03db2cbac96f03440f9e7a58f43f62d3e71b90d6b4b202bd75c0ec096d4d71efe0 023a04b2aaadfa39488dafe77a18b123f00300cc2ddcf99ae8c2114b5bf6c29772 OP_3 OP_CHECKMULTISIG',
//     path: '0/0'
//   }
// ]
```
