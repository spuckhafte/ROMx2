import { ASocket } from "plugboard.io";
import Chain from "../Schema/Chain.js";
import { BlockAsJSON, BlockType } from "../../types.js";

type field = "id" | "heading" | "details" | "filename";

export default class extends ASocket<[field: field, query: string]> {
    async run() {
        if (!this.args) return;

        const [field, query] = this.args;
        const actualField = field == 'id' ? field : "data." + field;

        const blocks: BlockAsJSON[] = (await Chain.find({ [actualField]: query })).map(block => {
            return {
                id: block.id as string,
                timestamp: block.timestamp as number,
                prevBlockHash: block.prevBlockHash as string,
                nonce: block.nonce as number,
                data: block.data as BlockType
            }
        });

        this.socket?.emit('search-result', blocks);
    }
}