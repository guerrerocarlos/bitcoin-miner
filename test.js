const test = require('ava');
const BTCMiner = require('.');

const block = {
	version: 536870912,
	previousblockhash: '00000000000000000061abcd4f51d81ddba5498cff67fed44b287de0990b7266',
	merkleroot: '871148c57dad60c0cde483233b099daa3e6492a91c13b337a5413a4c4f842978',
	time: 1515252561,
	bits: '180091c1'
};

const miner = new BTCMiner(block);

const nonce = 45291998;

test('Get Block Difficulty Target', t => {
	t.deepEqual(miner.getTarget().toString('hex'), '00000000000000000091c1000000000000000000000000000000000000000000');
});

test('Get block hash', t => {
	t.deepEqual(miner.getHash(nonce).toString('hex'), '00000000000000000020cf2bdc6563fb25c424af588d5fb7223461e72715e4a9');
});

test('Verify that hash is less than target', t => {
	t.true(miner.checkHash(Buffer.from('00000000000000000020cf2bdc6563fb25c424af588d5fb7223461e72715e4a9', 'hex')));
});

test('Check nonce validity', t => {
	t.true(miner.verifyNonce(block, nonce));
});
