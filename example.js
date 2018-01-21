const BTCMiner = require('.');

// Example block:
// https://insight.bitpay.com/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
// JSON: https://insight.bitpay.com/api/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50

const block = {
	version: 2,
	previousblockhash: '000000000000000117c80378b8da0e33559b5997f2ad55e2f7d18ec1975b9717',
	merkleroot: '871714dcbae6c8193a2bb9b2a69fe1c0440399f38d94b3a0f1b447275a29978a',
	time: 1392872245,
	bits: '19015f53'
};

const miner = new BTCMiner(block);
let hash;

// Calculate the target based on current dificulty for this block (block.bits)
const target = miner.getTarget();
console.log(target.toString('hex'), '<- TARGET');

// Since it's just a demonstration example,
// lets start with an nonce closer to the final result (856192328), so it takes less time
let nonce = 856000000;

let found = false;
while (nonce < 856192330 && !found) {
	hash = miner.getHash(nonce);
	found = miner.checkHash(hash);
	console.log(hash.toString('hex'), nonce, found ? '<- nonce FOUND!!' : '');
	nonce++;
}
