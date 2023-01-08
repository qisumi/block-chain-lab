import express, { Router } from 'express'
import { Block } from '../Blockchain/Block';
import { BlockData } from '../Blockchain/BlockData';
import { Qcoin, db, nodeAddress } from '../Blockchain/Qcoin';
import { serverLogger } from '../logger/Logger';

const nodeApi: Router = express.Router()

// fetch entire blockchain
nodeApi.get('/blockchain', function (req, res) {
    serverLogger.info('api called: /blockchain')
    res.send(Qcoin);
})

// create a new transaction
nodeApi.put('/transaction', function (req, res) {
    serverLogger.info('api called: /transaction')
    const { amount, sender, recipient } = req.body;
    Qcoin.createNewTransaction(amount, sender, recipient);
    const blockIndex: number = Qcoin.getLastBlock().index + 1;
    db.set('chain', Qcoin.chain);
    db.set('pendingTransactions', Qcoin.pendingTransactions);
    res.json({
        note: `Transaction will be added in block ${blockIndex}.`
    });
})

// mine a new block
nodeApi.get('/mine', function (req, res) {
    serverLogger.info('api called: /mine');

    const lastBlock: Block = Qcoin.getLastBlock();
    const prevBlockHash: string = lastBlock.hash
    const currentBlockData: BlockData = {
        transactions: Qcoin.pendingTransactions,
        index: lastBlock.index + 1
    }
    const nonce: number = Qcoin.proofOfWork(prevBlockHash, currentBlockData);
    const hash: string = Qcoin.hashBlock(prevBlockHash, currentBlockData, nonce);

    // sender 00 means it's bonus for miner
    Qcoin.createNewTransaction(12.5, "00", nodeAddress);

    const newBlock = Qcoin.createNewBlock(nonce, prevBlockHash, hash);
    db.set('chain', Qcoin.chain);
    db.set('pendingTransactions', Qcoin.pendingTransactions);
    res.json({
        note: "New block mined successfully",
        block: newBlock
    })
})

export { nodeApi }