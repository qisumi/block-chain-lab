import {Transaction} from "./Transaction";

export interface Block {
    index: number,
    timestamp: number,
    transactions: Transaction[],
    nonce: number,
    previousBlockHash: string,
    hash: string

}