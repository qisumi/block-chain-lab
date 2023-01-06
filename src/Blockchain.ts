import {Block} from "./Block";
import {Transaction} from "./Transaction";

export class Blockchain {
    chain: Block[]
    // transaction waiting for being putted into a block
    newTransactions: Transaction[]

    constructor() {
        this.chain = [];
        this.newTransactions = [];
    }

    createNewBlock(nonce: number, previousBlockHash: string, hash: string): Block {
        const newBlock: Block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.newTransactions,
            nonce: nonce,
            previousBlockHash: previousBlockHash,
            hash: hash
        };
        this.newTransactions = [];
        this.chain.push(newBlock);
        return newBlock;
    }
}