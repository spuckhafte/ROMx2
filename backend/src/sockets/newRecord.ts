import { ASocket } from "plugboard.io";
import { BlockType } from "../../types.js";
import { writeFile, readdir } from "fs/promises";
import Block from "../helpers/Block.js";
import { EVault } from "../index.js";
import Pending from "../Schema/Pending.js";
import Chain from "../Schema/Chain.js";

const NO_FILE = 'N/A'
const FILE_LOC = '../backend/assets/docs'

export default class extends ASocket<[data: BlockType, file: Buffer | undefined]> {
    async run() {
        if (!this.args) return;

        const otherFiles = await readdir(FILE_LOC);
        const [data, file] = this.args;

        const block = new Block(data, EVault.chain[EVault.chain.length - 1].hash);

        // if file of the same name already exists, prefix it with id of the block
        if (otherFiles.includes(data.fileName))
            data.fileName = block.id + "-" + data.fileName;

        // raise error if user tries to reference nonexisting parent
        if (data.parent) {
            const parentExists = EVault.chain.find(rec => rec.id == block.data.parent);
            if (!parentExists) {
                this.socket?.emit('error-uploading', 'no-parent');
                return;
            }
        }

        if (file) {
            // if file name is N/A, rename it to id of thet block
            if (data.fileName == NO_FILE)
                data.fileName = block.id;

            try {
                await writeFile(`${FILE_LOC}/${data.fileName}`, file);
            } catch {
                this.socket?.emit('error-uploading', 'system');
                return;
            }
        }

        if (block.data.parent) {
            const totalChildren = EVault.chain.filter(rec => rec.data.parent == block.data.parent).length;
            let version = totalChildren ? totalChildren : 1;

            const pendingLastChild = (
                await Pending
                    .find({ 'data.parent': block.data.parent })
                    .sort({ 'data.version': -1 })
            )[0];

            if (pendingLastChild && pendingLastChild.id)
                version = pendingLastChild.data?.version as number;

            block.data.version = version;
        }

        await Pending.insertMany([block.asJSON]);
        this.io?.emit('data-uploaded');
    }
}