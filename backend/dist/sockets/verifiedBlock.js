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
import Chain from "../Schema/Chain.js";
import Block from "../helpers/Block.js";
import { EVault } from "../index.js";
export default class extends ASocket {
    run() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.args)
                return;
            const [hashProvided, nonce] = this.args;
            const latestPendingBlock = (yield Chain.find({}).sort('timestamp'))[0];
            const block = new Block(latestPendingBlock.data, latestPendingBlock.prevBlockHash).initOtherData({
                id: latestPendingBlock.id,
                timestamp: latestPendingBlock.timestamp,
                nonce
            });
            if (block.hash === hashProvided && EVault.hashDesignIsValid(hashProvided)) {
                const status = EVault.addBlock(block);
                if (typeof status === 'string') {
                    (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit('errorAddingBlock', status);
                    return;
                }
                (_b = this.io) === null || _b === void 0 ? void 0 : _b.emit("newBlockAdded", block.asJSON);
            }
            else {
                if (block.hash !== hashProvided)
                    (_c = this.socket) === null || _c === void 0 ? void 0 : _c.emit('errorAddingBlock', '[err: wrong nonce mined]');
                else
                    (_d = this.socket) === null || _d === void 0 ? void 0 : _d.emit('errorAddingBlock', '[err: hash not as per the std. design]');
            }
        });
    }
}
