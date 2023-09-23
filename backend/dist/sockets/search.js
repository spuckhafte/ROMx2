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
            if (!this.args)
                return;
            const [field, query] = this.args;
            const actualField = field == 'id' ? field : "data." + field;
            const blocks = (yield Chain.find({ [actualField]: query })).map(block => {
                return {
                    id: block.id,
                    timestamp: block.timestamp,
                    prevBlockHash: block.prevBlockHash,
                    nonce: block.nonce,
                    data: block.data
                };
            });
            (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit('search-result', blocks);
        });
    }
}
