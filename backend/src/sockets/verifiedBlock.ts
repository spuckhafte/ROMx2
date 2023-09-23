import { ASocket } from "plugboard.io";
import Chain from "../Schema/Chain.js";
import Block from "../helpers/Block.js";
import { BlockType } from "../../types.js";
import { EVault } from "../index.js";

export default class extends ASocket<[hash: string, nonce: number]> {
    async run() {
        if (!this.args) return;

        const [hashProvided, nonce] = this.args;

        const latestPendingBlock = (await Chain.find({}).sort('timestamp'))[0];

        const block = new Block(
            latestPendingBlock.data as BlockType, 
            latestPendingBlock.prevBlockHash as string
        ).initOtherData({
            id: latestPendingBlock.id as string,
            timestamp: latestPendingBlock.timestamp as number,
            nonce
        });

        if (block.hash === hashProvided && EVault.hashDesignIsValid(hashProvided)) {
            const status = EVault.addBlock(block);

            if (typeof status === 'string') {
                this.socket?.emit('errorAddingBlock', status);
                return;
            }
            
            this.io?.emit("newBlockAdded", block.asJSON);
        } else {
            if (block.hash !== hashProvided)
                this.socket?.emit('errorAddingBlock', '[err: wrong nonce mined]');
            else
                this.socket?.emit('errorAddingBlock', '[err: hash not as per the std. design]');
        }
    }
}