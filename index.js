const crypto = require('crypto');
const chalk = require('chalk');

class Miner {
	constructor(block) {
		// Initialize local variables with Block data
		const prevBlockHash = Buffer.from(block.previousblockhash, 'hex');
		const mrklRoot = Buffer.from(block.merkleroot, 'hex');
		const {time, version} = block;

		// Calculate target based on block's "bits",
		// The "bits" variable is a packed representation of the Difficulty in 8 bytes, to unpack it:
		// First two bytes make the "exponent", and the following 4 bytes make the "mantissa":
		// https://en.bitcoin.it/wiki/Difficulty#What_is_the_formula_for_difficulty
		const bits = parseInt('0x' + block.bits, 16);
		const exponent = bits >> 24;
		const mantissa = bits & 0xFFFFFF;
		const target = (mantissa * (2 ** (8 * (exponent - 3)))).toString('16');

		// Make target a Buffer object
		this.targetBuffer = Buffer.from('0'.repeat(64 - target.length) + target, 'hex');

		// Create little-endian long int (4 bytes) with the version (2) on the first byte
		this.versionBuffer = Buffer.alloc(4);
		this.versionBuffer.writeInt32LE(version, 0);

		// Reverse the previous Block Hash and the merkle_root
		this.reversedPrevBlockHash = this.reverseBuffer(prevBlockHash);
		this.reversedMrklRoot = this.reverseBuffer(mrklRoot);

		// Buffer with time (4 Bytes), bits (4 Bytes) and nonce (4 Bytes) (later added and updated on each hash)
		this.timeBitsNonceBuffer = Buffer.alloc(12);
		this.timeBitsNonceBuffer.writeInt32LE(time, 0);
		this.timeBitsNonceBuffer.writeInt32LE(bits, 4);
	}

	reverseBuffer(src) {
		const buffer = Buffer.alloc(src.length);
		for (let i = 0, j = src.length - 1; i <= j; ++i, --j) {
			buffer[i] = src[j];
			buffer[j] = src[i];
		}
		return buffer;
	}

	sha256(buf) {
		return crypto.createHash('sha256').update(buf).digest();
	}

	sha256sha256(buf) {
		return this.sha256(this.sha256(buf));
	}

	getHash(nonce) {
		// Update nonce in header Buffer
		this.timeBitsNonceBuffer.writeInt32LE(nonce, 8);
		// Double sha256 hash the header
		return this.reverseBuffer(this.sha256sha256(Buffer.concat([this.versionBuffer, this.reversedPrevBlockHash, this.reversedMrklRoot, this.timeBitsNonceBuffer])));
	}

	reverseString(str) {
		if (str.length < 8) { // Make sure the HEX value from the integers fill 4 bytes when converted to buffer, so that they are reversed correctly
			str = '0'.repeat(8 - str.length) + str;
		}
		return this.reverseBuffer(Buffer.from(str, 'hex')).toString('hex');
	}

	verifyNonce(block, checknonce) {
		// This is a (maybe easier) way to build the header from scratch, it should generate the same hash:
		console.log(`\n[Verify Nonce ${checknonce} ${checknonce.toString(16)}]`);
		const version = this.reverseString(block.version.toString(16));
		const prevhash = this.reverseString(block.previousblockhash);
		const merkleroot = this.reverseString(block.merkleroot);
		const nbits = this.reverseString(block.bits);
		const ntime = this.reverseString(block.time.toString(16));
		const nonce = this.reverseString(checknonce.toString(16));

		console.log('        ', chalk.gray('version') + ' '.repeat(version.length - 7) + chalk.cyanBright('prevhash') + ' '.repeat(prevhash.length - 8) + chalk.blue('merkleroot') + ' '.repeat(prevhash.length - 10) + chalk.magenta('ntime') + ' '.repeat(ntime.length - 5) + chalk.cyan('nbits') + ' '.repeat(nbits.length - 5) + chalk.yellow('nonce'));
		console.log('Header: ', chalk.gray(version) + chalk.cyanBright(prevhash) + chalk.blue(merkleroot) + chalk.magenta(ntime) + chalk.cyan(nbits) + chalk.yellow(nonce));

		const header = version + prevhash + merkleroot + ntime + nbits + nonce;
		const hash = this.reverseString(this.sha256sha256(Buffer.from(header, 'hex')));
		console.log('Target: ', this.getTarget().toString('hex'));
		console.log('Hash:   ', hash.toString('hex'));

		const isvalid = this.getTarget().toString('hex') > hash;
		const result = isvalid ? 'valid' : 'not a valid';
		const color = isvalid ? chalk.green : chalk.red;
		console.log('Result: ', color(`${checknonce} is a ${result} nonce`));
		return isvalid;
	}

	getTarget() {
		return this.targetBuffer;
	}

	checkHash(hash) {
		return Buffer.compare(this.getTarget(), hash) > 0;
	}
}

module.exports = Miner;
