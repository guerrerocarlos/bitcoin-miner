const test = require('ava');
const bitcoinminer = require('.');

const block = {
	hash: '0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50',
	version: 2,
	merkleroot: '871714dcbae6c8193a2bb9b2a69fe1c0440399f38d94b3a0f1b447275a29978a',
	time: 1392872245,
	bits: '19015f53',
	previousblockhash: '000000000000000117c80378b8da0e33559b5997f2ad55e2f7d18ec1975b9717',
	nextblockhash: '0000000000000000b0f08ec6a3d1e84994498ecf993a9981f57982cfdb66c443'
};

const miner = bitcoinminer(block);

const nonce = 856192328;

test('Get Block Difficulty Target', t => {
	const target = miner.getTarget();
	t.deepEqual(target.toString(16), '15f5300000000000000000000000000000000000000000000');
});

test('Get block hash', t => {
	const hash = miner.hash(nonce);
	t.deepEqual(hash.toString('hex'), '0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50');
});

test('Verify that hash is less than target', t => {
	const hash = miner.hash(nonce);
	const target = miner.getTarget();
	t.true(hash < target);
});
