import Block from "./Block.js";
import Transaction from './Transaction.js';
import * as crypto from 'crypto';
export default class Chain {
    constructor(chainId) {
        var _a;
        this.theChain = [];
        let genesisBlock = new Block(chainId, new Transaction(0, '?', '_'), '_first_block_thus_no_prev_hash_');
        genesisBlock.match = '^0.+';
        genesisBlock = (_a = this.mine(genesisBlock)) !== null && _a !== void 0 ? _a : genesisBlock;
        this.theChain.push(genesisBlock);
        this.id = chainId;
    }
    ;
    get previousBlock() {
        return this.theChain[this.theChain.length - 1];
    }
    mine(block) {
        console.log('⛏️ mining...');
        let solution = 0;
        while (true) {
            block.proto.nonce = solution;
            block.proto.transaction.valid = true;
            const hash = block.gethash().toString();
            if ((new RegExp(block.proto.match)).test(hash)) {
                block.hash = hash;
                block.nonce = solution;
                block.transaction.valid = true;
                return block;
            }
            block.proto.transaction.valid = false;
            solution += 1;
        }
    }
    ;
    addBlock(chainId, transaction, signature) {
        if (chainId !== this.id) {
            return null;
        }
        const verify = crypto.createVerify('sha256');
        verify.update(transaction.toString());
        const isValid = verify.verify(transaction.payer, signature);
        if (isValid) {
            const invalidBlock = new Block(chainId, transaction, this.previousBlock.hash.toString());
            const minedBlock = this.mine(invalidBlock);
            if (!minedBlock)
                return;
            this.theChain.push(minedBlock);
            console.log(`Transaction (${transaction.id}) Validated`);
            return minedBlock;
        }
    }
}
