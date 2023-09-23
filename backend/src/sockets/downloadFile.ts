import { ASocket } from "plugboard.io";
import { readFile } from "fs/promises";

export default class extends ASocket<[file: string]> {
    async run() {
        if (!this.args) return;
        const [file] = this.args;

        const fileData = await readFile(`../backend/assets/docs/${file}`, { encoding: "utf-8" });
        this.socket?.emit('downFile', file, fileData);
    }
}