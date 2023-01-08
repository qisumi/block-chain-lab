import { Block } from "./Block";
import { Transaction } from "./Transaction";
import { createHash } from "crypto";
import { BlockData } from "./BlockData";

const nodeUrl = process.argv[3];

export class Blockchain {
    chain: Block[]
    pendingTransactions: Transaction[]
    currentNodeUrl: string
    networkNodes: Set<string>
    
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.currentNodeUrl = nodeUrl;
        this.networkNodes = new Set();
        this.createNewBlock(100, '0', 'QISUMI');
    }

    /**
     * 
     * @returns block created
     */
    createNewBlock(nonce: number, previousBlockHash: string, hash: string): Block {
        const newBlock: Block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce: nonce,
            previousBlockHash: previousBlockHash,
            hash: hash
        };
        this.pendingTransactions = [];
        this.chain.push(newBlock);
        return newBlock;
    }

    getLastBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    /**
     * 
     * @returns the index of block that transaction to be pushed
     */
    createNewTransaction(amount: number, sender: string, recipient: string): number {
        const newTransaction: Transaction = {
            amount: amount,
            sender: sender,
            recipient: recipient
        }
        this.pendingTransactions.push(newTransaction);
        return this.getLastBlock().index + 1;
    }

    /**
     * hash a block into a string
     */
    hashBlock(prevBolckHash: string, currentBlockData: BlockData, nonce: number): string {
        const hash = createHash('sha256');
        const dataAsString = prevBolckHash + nonce.toString()
            + JSON.stringify(currentBlockData);
        return hash.update(dataAsString).digest('hex');
    }

    /**
     * 
     * @returns nonce calculated
     */
    proofOfWork(prevBlockHash: string, currentBlockData: BlockData): number {
        let nonce: number = 0;
        let hash: string = this.hashBlock(prevBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 2) !== '00') {
            nonce = nonce + 1;
            hash = this.hashBlock(prevBlockHash, currentBlockData, nonce);
        }
        return nonce
    }
}