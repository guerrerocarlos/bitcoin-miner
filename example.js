const BTCMiner = require('.');

const testBlocks = [
	// Example Version 1 block:
	// Web Explorer:  https://insight.bitpay.com/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
	// JSON download: https://insight.bitpay.com/api/block/0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
	{
		block: {
			version: 2,
			previousblockhash: '000000000000000117c80378b8da0e33559b5997f2ad55e2f7d18ec1975b9717',
			merkleroot: '871714dcbae6c8193a2bb9b2a69fe1c0440399f38d94b3a0f1b447275a29978a',
			time: 1392872245,
			bits: '19015f53'
		},
		initialNonce: 856192320 // Correct nonce will be:  856192328
	},
	// Example Version 02000000 block
	// Web Explorer:  https://insight.bitpay.com/block/00000000000000000020cf2bdc6563fb25c424af588d5fb7223461e72715e4a9
	// JSON download: https://insight.bitpay.com/api/block/00000000000000000020cf2bdc6563fb25c424af588d5fb7223461e72715e4a9
	{
		block: {
			version: 536870912,
			previousblockhash: '00000000000000000061abcd4f51d81ddba5498cff67fed44b287de0990b7266',
			merkleroot: '871148c57dad60c0cde483233b099daa3e6492a91c13b337a5413a4c4f842978',
			time: 1515252561,
			bits: '180091c1'
		},
		initialNonce: 45291990 // Correct nonce will be: 45291998
	}
];

const selectedBlock = 0; // CHANGE THIS TO 1 to use the second testBlock
const block = testBlocks[selectedBlock].block;
let nonce = testBlocks[selectedBlock].initialNonce;

const miner = new BTCMiner(block);

// Calculate the target based on current dificulty for this block (block.bits)
const target = miner.getTarget();
console.log('The target for this block is:');
console.log(target.toString('hex'));

let hash;
let found = false;

console.log('\n[Start Mining with initial nonce:', nonce, ']');
while (nonce < 8561950000 && !found) {
	hash = miner.getHash(nonce);
	found = miner.checkHash(hash);
	console.log(hash.toString('hex'), nonce, found ? '<- nonce FOUND!!' : '');
	if (found) {
		miner.verifyNonce(block, nonce);
	}
	nonce++;
}
