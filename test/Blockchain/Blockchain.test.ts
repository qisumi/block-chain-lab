import { Blockchain } from "../../src/Blockchain/Blockchain";
import { test, expect, beforeAll, jest, afterAll } from '@jest/globals'
import Mock from 'mockjs'
import { Transaction } from "../../src/Blockchain/Transaction";
import { testLogger } from "../../src/logger/Logger";
import { BlockData } from "../../src/Blockchain/BlockData";

let Random: Mock.MockjsRandom;
beforeAll(() => {
    Random = Mock.Random;
    jest.useFakeTimers()
})
afterAll(() => {
    jest.useRealTimers()
})

test(
    'create new blockchain', () => {
        const bitcoin: Blockchain = new Blockchain();
        expect(bitcoin.chain.length)
            .toEqual(1)
        expect(bitcoin.pendingTransactions)
            .toEqual([])
        expect(bitcoin.chain[0].hash)
            .toEqual('QISUMI')
    }
)

test(
    'create new block', () => {
        const bitcoin: Blockchain = new Blockchain();
        const prevHash: string = Random.string(10);
        const hash: string = Random.string(10);
        bitcoin.createNewBlock(2389, prevHash, hash);
        expect(bitcoin.chain.length).toEqual(2);
        expect(bitcoin.chain[1].nonce).toEqual(2389);
        expect(bitcoin.chain[1].hash).toEqual(hash);
        expect(bitcoin.chain[1].previousBlockHash).toEqual(prevHash);
        expect(bitcoin.chain[1].index).toEqual(2);
        expect(bitcoin.chain[1].timestamp).toEqual(jest.now());
    }
)

test(
    'create several blocks', () => {
        const bitcoin: Blockchain = new Blockchain();
        const hash0 = Random.string(10)
        const hash1 = Random.string(10);
        const hash2 = Random.string(10);
        const hash3 = Random.string(10);
        bitcoin.createNewBlock(2389, hash0, hash1);
        bitcoin.createNewBlock(2389, hash1, hash2);
        bitcoin.createNewBlock(2389, hash2, hash3);
        expect(bitcoin.chain.length).toEqual(4);
    }
)

test(
    'create new transaction', () => {
        const bitcoin: Blockchain = new Blockchain();
        bitcoin.createNewTransaction(100, 'qisumi', 'foo');
        expect(bitcoin.pendingTransactions.length).toEqual(1);
        bitcoin.createNewTransaction(100, 'qisumi', 'bar');
        expect(bitcoin.pendingTransactions.length).toEqual(2);
        bitcoin.createNewBlock(0, 'FIRST BLOCK', 'ASHJKFG8ASH');
        expect(bitcoin.pendingTransactions.length).toEqual(0);
        expect(bitcoin.getLastBlock().transactions.length).toEqual(2);
    }
)

test(
    'test for hashBlock method', () => {
        const bitcoin: Blockchain = new Blockchain();
        const prevBlockHash: string = 'AJKLSDFAJSDYANWEF';
        const currentBlockData: BlockData = {
            transactions: [
                {
                    amount: 10,
                    sender: 'KASHJDKHFLQNQWJ',
                    recipient: 'JOIFBQLSQNMWEJ',
                    transactionId: 'ASKDJHIQFNB'
                },
                {
                    amount: 20,
                    sender: 'KASHJDKHFLQNQWJ',
                    recipient: 'JOIFBQLSQNMWEJ',
                    transactionId: 'ASKDJHIQQAWFNB'
                }
            ],
            index: 1
        }
        const nonce: number = 100;
        const hash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce);
        testLogger.debug(hash);
    }
)

test(
    'test proofOfWork method', () => {
        const bitcoin: Blockchain = new Blockchain();
        const prevBlockHash: string = 'AJKLSDFAJSDYANWEF';
        const currentBlockData: BlockData = {
            transactions: [
                {
                    amount: 10,
                    sender: 'KASHJDKHFLQNQWJ',
                    recipient: 'JOIFBQLSQNMWEJ',
                    transactionId: 'ASKDJHIQFNB'
                },
                {
                    amount: 20,
                    sender: 'KASHJDKHFLQNQWJ',
                    recipient: 'JOIFBQLSQNMWEJ',
                    transactionId: 'ASKDJHIQQAWFNB'
                }
            ],
            index: 1
        }
        const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData);
        testLogger.debug(`test proofOfWork mthod, nonce: ${nonce}`);
        const hash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce)
        testLogger.debug(`test proofOfWork mthod, hash: ${hash}`)
        expect(hash.substring(0, 2)).toEqual('00');
    }
)