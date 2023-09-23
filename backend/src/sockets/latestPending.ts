import { ASocket } from "plugboard.io";
import Pending from "../Schema/Pending.js";
import Block from "../helpers/Block.js";
import { BlockType } from "../../types.js";
import { EVault } from "../index.js";

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

        this.socket?.emit('pendingBlockString', block.asJSON);
    }
}