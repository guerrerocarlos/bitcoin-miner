# bitcoin-miner [![Build Status](https://travis-ci.org/guerrerocarlos/bitcoin-miner.svg?branch=master)](https://travis-ci.org/guerrerocarlos/bitcoin-miner) [![Coverage Status](https://coveralls.io/repos/github/guerrerocarlos/bitcoin-miner/badge.svg?branch=master)](https://coveralls.io/github/guerrerocarlos/bitcoin-miner?branch=master) [![Build status](https://ci.appveyor.com/api/projects/status/lvq1mnsbdo8l2cv4?svg=true)](https://ci.appveyor.com/project/guerrerocarlos/bitcoin-miner) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)


> Super-slow yet very educative Bitcoin miner (BTC/BCH) in Javascript

## Install

```
$ npm install bitcoin-miner
```


## Usage



```js
const BTCMiner = require('bitcoin-miner');
// View this block in Block Explorer:  https://insight.bitpay.com/block/00000000000000000020cf2bdc6563fb25c424af588d5fb7223461e72715e4a9
// Get it in JSON format: https://insight.bitpay.com/api/block/00000000000000000020cf2bdc6563fb25c424af588d5fb7223461e72715e4a9
const block = {
	version: 536870912,
	previousblockhash: '00000000000000000061abcd4f51d81ddba5498cff67fed44b287de0990b7266',
	merkleroot: '871148c57dad60c0cde483233b099daa3e6492a91c13b337a5413a4c4f842978',
	time: 1515252561,
	bits: '180091c1'
};
let nonce = 45291990 // initial nonce

const miner = new BTCMiner(block);

// Calculate the target based on current dificulty for this block (block.bits)
const target = miner.getTarget();
console.log('The target for this block is:');
console.log(target.toString('hex'));

let hash;
let found = false;

console.log('\n[Start Mining with initial nonce:', nonce, ']');
while (nonce < (45291990+10000) && !found) { // check the next 1000 nonces starting from 45291990
	hash = miner.getHash(nonce);
	found = miner.checkHash(hash);
	console.log(hash.toString('hex'), nonce, found ? '<- nonce FOUND!!' : '');
	if (found) {
		miner.verifyNonce(block, nonce);
	}
	nonce++;
}

```
## Example Output

![Terminal Output](https://raw.githubusercontent.com/guerrerocarlos/bitcoin-miner/master/screenshot.png)

## API

### getTarget()

Returns the target `Buffer` for that block based on it's **bits** (difficulty).

### getHash(nonce)

Returns the sha256sha256 hash `Buffer` for that block's **nonce**.

### checkHash(hash)

Returns a `Boolean` with **true** if the hash is lower than the target and viceversa.

### checkHash(block, hash)

Print colored verification of the *hash* against the *target* on the console (the code shows another way to build the block header in javascript).


## Related

- [Bitcoin mining the hard way: the algorithms, protocols, and bytes](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html) - Inspiration for this module.
- [What is (bitcoin) "difficulty"](https://en.bitcoin.it/wiki/Difficulty#What_is_the_formula_for_difficulty) - Bitcoin Difficulty calculations and algorithms.


## License

MIT © [Carlos Guerrero](https://carlosguerrero.com)
