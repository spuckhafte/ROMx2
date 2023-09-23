import { createHash } from "crypto";
import { v4 } from 'uuid';
export default class Block {
    constructor(data, prevBlockHash) {
        this.nonce = 0;
        this.id = v4();
        this.data = data;
        this.timestamp = Date.now();
        this.prevBlockHash = prevBlockHash;
    }
    get hash() {
        const blockStr = JSON.stringify(this.asJSON);
        const hash = createHash('SHA256');
        hash.update(blockStr).end();
        return hash.digest('hex');
    }
    get toString() {
        return JSON.stringify(this);
    }
    get asJSON() {
        return {
            id: this.id,
            nonce: this.nonce,
            timestamp: this.timestamp,
            prevBlockHash: this.prevBlockHash,
            data: this.data,
        };
    }
    initOtherData(otherData) {
        this.id = otherData.id;
        this.timestamp = otherData.timestamp;
        this.nonce = otherData.nonce;
        return this;
    }
}
