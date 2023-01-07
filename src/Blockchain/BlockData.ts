import { Transaction } from "./Transaction";

export interface BlockData{
    transactions: Transaction[],
    index: number
}