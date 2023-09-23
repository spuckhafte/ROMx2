import { ASocket } from "plugboard.io";
import Chain from "../Schema/Chain.js";
import { BlockAsJSON } from "../../types.js";

export default class extends ASocket<[]> {
    async run() {
        const blocks = await Chain.find({}).sort('-1');
        const sendBlocks = blocks.map((bl) => {
            return {
                id: bl.id,
                timestamp: bl.timestamp,
                prevBlockHash: bl.prevBlockHash,
                nonce: bl.nonce,
                data: bl.data,
            } as BlockAsJSON;
        });
        sendBlocks.shift();
        console.log(sendBlocks);
        console.log(sendBlocks.reverse());
        this.socket?.emit('allBlocks', sendBlocks.reverse());
    }
}