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
export default class extends ASocket {
    run() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const blocks = yield Chain.find({}).sort('-1');
            const sendBlocks = blocks.map((bl) => {
                return {
                    id: bl.id,
                    timestamp: bl.timestamp,
                    prevBlockHash: bl.prevBlockHash,
                    nonce: bl.nonce,
                    data: bl.data,
                };
            });
            sendBlocks.shift();
            console.log(sendBlocks);
            console.log(sendBlocks.reverse());
            (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit('allBlocks', sendBlocks.reverse());
        });
    }
}
