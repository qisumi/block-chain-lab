import express, { Router } from 'express'
import fetch, { Response } from 'node-fetch';
import { Block } from '../Blockchain/Block';
import { BlockData } from '../Blockchain/BlockData';
import { Qcoin, nodeAddress, syncDb } from '../Blockchain/Qcoin';
import { Transaction } from '../Blockchain/Transaction';
import { serverLogger } from '../logger/Logger';

const nodeApi: Router = express.Router()

// fetch entire blockchain
nodeApi.get('/blockchain', function (req, res) {
    serverLogger.info('api called: /blockchain')
    res.send({ Qcoin, networkNodes: [...Qcoin.networkNodes] });
})

// create a new transaction
nodeApi.post('/transaction', function (req, res) {
    serverLogger.info('api called: /transaction')
    const { newTransaction } = req.body;
    const blockIndex = Qcoin.addTransactiionToPending(newTransaction);
    res.json({
        note: `Transaction will be added in block ${blockIndex}.`
    });
    syncDb()
})

// broadcast a transaction
nodeApi.post('/transaction/broadcast', (req, res) => {
    serverLogger.info('api called: /transaction/broadcast')
    const { amount, sender, recipient } = req.body;
    const newTransaction: Transaction = Qcoin.createNewTransaction(amount, sender, recipient);
    Qcoin.addTransactiionToPending(newTransaction);

    const requestPromises: Promise<Response>[] = [];

    Qcoin.networkNodes.forEach(nodeUrl => {
        requestPromises.push(fetch(nodeUrl + '/transaction', {
            method: 'POST',
            body: JSON.stringify({
                newTransaction: newTransaction
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }))
    })

    Promise.all(requestPromises)
        .then(data => {
            res.json({
                note: 'Transaction created and broadcast successfully.'
            })
            syncDb()
        })
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

    res.json({
        note: "New block mined successfully",
        block: newBlock
    })
    syncDb()
})

export { nodeApi }