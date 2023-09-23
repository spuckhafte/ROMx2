var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Block from "./Block.js";
import Chain from "../Schema/Chain.js";
import mongoose from "mongoose";
import secret from '../secret.json' assert { type: "json" };
class EVaultChain {
    constructor() {
        this.chain = [];
        this.chainImpureCb = null;
        this.initDb();
    }
    addBlock(block) {
        /*
            - Detect if chain has been altered anywhere,
            - if impure, no more blocks can be added unless the issue is fixed,
            - its illegal to alter any block.
        */
        const pureChain = this.chainIsPure();
        if (!pureChain) {
            if (this.chainImpureCb)
                this.chainImpureCb();
            return "[error: chain impure (breach suspected)]";
        }
        const prevBlockHash = this.chain[this.chain.length - 1].hash;
        if (block.prevBlockHash !== prevBlockHash)
            return "[rejected: invalid previous block]";
        if (!this.hashDesignIsValid(block.hash))
            return "[rejected: invalid hash]";
        this.chain.push(block);
        Chain.insertMany([block.asJSON]);
        return true;
    }
    chainIsPure() {
        let isImpure = false;
        for (let i = 1; i < this.chain.length; i++) {
            if (this.chain[i].prevBlockHash !== this.chain[i - 1].hash) {
                isImpure = true;
                break;
            }
        }
        return !isImpure;
    }
    hashDesignIsValid(hash) {
        const validator = new RegExp('^00', 'g');
        return validator.test(hash);
    }
    initDb() {
        mongoose.set('strictQuery', false);
        mongoose.connect(secret.DB, (e) => __awaiter(this, void 0, void 0, function* () {
            if (e)
                console.log(`[err: ${e}]`);
            else {
                console.log('[connected to DB]');
                const chainDb = yield Chain.find({}).sort('timestamp');
                if (chainDb.length == 0) {
                    const genesisBlock = this.genesis();
                    Chain.insertMany([genesisBlock.asJSON]);
                    return;
                }
                for (let blockData of chainDb) {
                    const block = new Block(blockData.data, blockData.prevBlockHash).initOtherData({
                        id: blockData.id,
                        timestamp: blockData.timestamp,
                        nonce: blockData.nonce,
                    });
                    this.chain.push(block);
                }
            }
        }));
        return this;
    }
    genesis() {
        const genesisBlock = new Block({
            heading: "Genesis",
            details: "N/A",
            fileName: "N/A",
            parent: "",
            version: 0,
        }, 'N/A');
        this.chain.push(genesisBlock);
        return genesisBlock;
    }
}
EVaultChain.eVault = new EVaultChain();
export default EVaultChain;
