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
import Pending from "../Schema/Pending.js";
import Block from "../helpers/Block.js";
import { EVault } from "../index.js";
export default class extends ASocket {
    run() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const pendingBlock = (yield Pending.find({}).sort('timestamp'))[0];
            if (!pendingBlock || !pendingBlock.id) {
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit('pending-block', []);
                return;
            }
            const block = new Block(pendingBlock.data, EVault.chain[EVault.chain.length - 1].hash).initOtherData({
                id: pendingBlock.id,
                timestamp: pendingBlock.timestamp,
                nonce: pendingBlock.nonce,
            });
            (_b = this.socket) === null || _b === void 0 ? void 0 : _b.emit('pendingBlockString', block.asJSON);
        });
    }
}
