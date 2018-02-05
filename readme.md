# bitcoin-miner [![Build Status](https://travis-ci.org/guerrerocarlos/bitcoin-miner.svg?branch=master)](https://travis-ci.org/guerrerocarlos/bitcoin-miner) [![Coverage Status](https://coveralls.io/repos/github/guerrerocarlos/bitcoin-miner/badge.svg?branch=master)](https://coveralls.io/github/guerrerocarlos/bitcoin-miner?branch=master) [![Build status](https://ci.appveyor.com/api/projects/status/lvq1mnsbdo8l2cv4?svg=true)](https://ci.appveyor.com/project/guerrerocarlos/bitcoin-miner) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)


> Super-slow yet very educative Bitcoin miner (BTC/BCH) in Javascript

## Install

```
$ npm install bitcoin-miner
```


## Usage



```js
const BTCMiner = require('bitcoin-miner');

// https://insight.bitpay.com/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
const block = {
	version: 2,
	previousblockhash: '000000000000000117c80378b8da0e33559b5997f2ad55e2f7d18ec1975b9717',
	merkleroot: '871714dcbae6c8193a2bb9b2a69fe1c0440399f38d94b3a0f1b447275a29978a',
	time: 1392872245,
	bits: '19015f53'
};

const miner = new BTCMiner(block);

let nonce = 856000000; // Arbitrary value to make the example execution shorter

let found = false;
while (nonce < 856192330 && !found) {
	hash = miner.getHash(nonce);
	found = miner.checkHash(hash);
	console.log(hash.toString('hex'), nonce, found ? '<- nonce FOUND!!' : '');
	nonce++;
}

```


## API

### getTarget()

Returns the target `Buffer` for that block based on it's **bits** (difficulty).

### getHash(nonce)

Returns the sha256sha256 hash `Buffer` for that block's **nonce**.

### checkHash(hash)

Returns a `Boolean` with **true** if the hash is lower than the target and viceversa.


## Related

- [Bitcoin mining the hard way: the algorithms, protocols, and bytes](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html) - Inspiration for this module.
- [What is (bitcoin) "difficulty"](https://en.bitcoin.it/wiki/Difficulty#What_is_the_formula_for_difficulty) - Bitcoin Difficulty calculations and algorithms.


## License

MIT © [Carlos Guerrero](https://carlosguerrero.com)
