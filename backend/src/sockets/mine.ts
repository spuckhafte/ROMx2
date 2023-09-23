import { ASocket } from "plugboard.io";
import Block from "../helpers/Block.js";
import { BlockType } from "../../types.js";
import Pending from "../Schema/Pending.js";
import { EVault } from "../index.js";
import Chain from "../Schema/Chain.js";

export default class extends ASocket<[]> {
    async run() {
        const pendingBlock = (await Pending.find({}).sort('timestamp'))[0];
        if (!pendingBlock || !pendingBlock.id) {
            this.socket?.emit('pending-block', []);
            return;
        }

        const block = new Block(
            pendingBlock.data as BlockType,
            EVault.chain[EVault.chain.length - 1].hash,
        ).initOtherData({
            id: pendingBlock.id as string,
            timestamp: pendingBlock.timestamp as number,
            nonce: pendingBlock.nonce as number,
        });

        for (let i = 0; ; i++) {
            block.nonce = i;
            if (!EVault.hashDesignIsValid(block.hash)) continue;

            const status = EVault.addBlock(block);
            if (typeof status === 'string') {
                this.socket?.emit('error-adding-block', status);
            } else {
                this.socket?.emit('block-added', 'New Block Added');
                this.io?.emit('update-recents');
                await Pending.deleteOne({ id: block.id });
            }

            break;
        }
    }
}