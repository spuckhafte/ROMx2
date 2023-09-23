var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ASocket } from "plugboard.io";
import { writeFile, readdir } from "fs/promises";
import Block from "../helpers/Block.js";
import { EVault } from "../index.js";
import Pending from "../Schema/Pending.js";
const NO_FILE = 'N/A';
const FILE_LOC = '../backend/assets/docs';
export default class extends ASocket {
    run() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.args)
                return;
            const otherFiles = yield readdir(FILE_LOC);
            const [data, file] = this.args;
            const block = new Block(data, EVault.chain[EVault.chain.length - 1].hash);
            // if file of the same name already exists, prefix it with id of the block
            if (otherFiles.includes(data.fileName))
                data.fileName = block.id + "-" + data.fileName;
            // raise error if user tries to reference nonexisting parent
            if (data.parent) {
                const parentExists = EVault.chain.find(rec => rec.id == block.data.parent);
                if (!parentExists) {
                    (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit('error-uploading', 'no-parent');
                    return;
                }
            }
            if (file) {
                // if file name is N/A, rename it to id of thet block
                if (data.fileName == NO_FILE)
                    data.fileName = block.id;
                try {
                    yield writeFile(`${FILE_LOC}/${data.fileName}`, file);
                }
                catch (_e) {
                    (_b = this.socket) === null || _b === void 0 ? void 0 : _b.emit('error-uploading', 'system');
                    return;
                }
            }
            if (block.data.parent) {
                const totalChildren = EVault.chain.filter(rec => rec.data.parent == block.data.parent).length;
                let version = totalChildren ? totalChildren : 1;
                const pendingLastChild = (yield Pending
                    .find({ 'data.parent': block.data.parent })
                    .sort({ 'data.version': -1 }))[0];
                if (pendingLastChild && pendingLastChild.id)
                    version = (_c = pendingLastChild.data) === null || _c === void 0 ? void 0 : _c.version;
                block.data.version = version;
            }
            yield Pending.insertMany([block.asJSON]);
            (_d = this.io) === null || _d === void 0 ? void 0 : _d.emit('data-uploaded');
        });
    }
}
