import {Blockchain} from "../src/Blockchain";
import {test, expect, beforeAll, jest, afterAll} from '@jest/globals'
import Mock from 'mockjs'

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
        expect(bitcoin.chain)
            .toEqual([])
        expect(bitcoin.newTransactions)
            .toEqual([])
    }
)

test(
    'create new block', () => {
        const bitcoin: Blockchain = new Blockchain();
        const prevHash = Random.string(10);
        const hash = Random.string(10);
        bitcoin.createNewBlock(2389, prevHash, hash);
        expect(bitcoin.chain.length).toEqual(1);
        expect(bitcoin.chain[0].nonce).toEqual(2389);
        expect(bitcoin.chain[0].hash).toEqual(hash);
        expect(bitcoin.chain[0].previousBlockHash).toEqual(prevHash);
        expect(bitcoin.chain[0].index).toEqual(1);
        expect(bitcoin.chain[0].timestamp).toEqual(jest.now());
    }
)

test(
    'create several blocks',()=>{
        const bitcoin: Blockchain = new Blockchain();
        const hash0 = Random.string(10)
        const hash1 = Random.string(10);
        const hash2 = Random.string(10);
        const hash3 = Random.string(10);
        bitcoin.createNewBlock(2389, hash0,hash1);
        bitcoin.createNewBlock(2389, hash1,hash2);
        bitcoin.createNewBlock(2389, hash2,hash3);
        expect(bitcoin.chain.length).toEqual(3);
    }
)