import { BlockType, ChainErrors } from "../../types.js";
import Block from "./Block.js";
import Chain from "../Schema/Chain.js";
import mongoose from "mongoose";
import secret from '../secret.json' assert { type: "json" };

export default class EVaultChain {
    public static eVault = new EVaultChain();

    chain: Block[] = [];
    chainImpureCb: CallableFunction | null = null;

    constructor() {
        this.initDb();
    }

    addBlock(block: Block): true | ChainErrors {

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

    hashDesignIsValid(hash: string) {
        const validator = new RegExp('^00', 'g');
        return validator.test(hash);
    }

    private initDb() {
        mongoose.set('strictQuery', false);
        mongoose.connect(secret.DB, async e => {
            if (e) console.log(`[err: ${e}]`);
            else {
                console.log('[connected to DB]');

                const chainDb = await Chain.find({}).sort('timestamp');

                if (chainDb.length == 0) {
                    const genesisBlock = this.genesis();
                    Chain.insertMany([genesisBlock.asJSON]);

                    return;
                }

                for (let blockData of chainDb) {
                    const block = new Block(
                        blockData.data as BlockType,
                        blockData.prevBlockHash as string
                    ).initOtherData({
                        id: blockData.id as string,
                        timestamp: blockData.timestamp as number,
                        nonce: blockData.nonce as number,
                    });

                    this.chain.push(block);
                }
            }
        });
        return this;
    }

    private genesis() {
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