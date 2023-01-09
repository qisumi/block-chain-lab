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
    const newBlock = Qcoin.createNewBlock(nonce, prevBlockHash, hash);

    const requestPromises: Promise<Response>[] = [];
    Qcoin.networkNodes.forEach(networkNodeUrl => {
        requestPromises.push(fetch(`${networkNodeUrl}/recieve-new-block`, {
            method: 'PUT',
            body: JSON.stringify({
                newBlock: newBlock
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }))
    })

    Promise.all(requestPromises)
        .then(data => {
            // sender 00 means it's bonus for miner
            //Qcoin.createNewTransaction(12.5, "00", nodeAddress);
            fetch(Qcoin.currentNodeUrl + '/transaction/broadcast', {
                method: "post",
                body: JSON.stringify({
                    amount: 12.5,
                    sender: '00',
                    recipient: nodeAddress
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        })

    res.json({
        note: "New block mined successfully",
        block: newBlock
    })
    syncDb()
})

nodeApi.put('/recieve-new-block', (req, res) => {
    serverLogger.info('api called: /receive-new-block');
    const { newBlock } = req.body
    const lastBlock = Qcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock.index + 1 === newBlock.index;
    if (correctHash && correctIndex) {
        serverLogger.info(`new block valid`);
        Qcoin.chain.push(newBlock);
        Qcoin.pendingTransactions = [];
        res.json({
            note: 'New block received and accepted.',
            newBlock: newBlock
        })
    }else{
        serverLogger.info(`new block invalid,${lastBlock.hash},${newBlock.previousBlockHash}`);
        res.json({
            note: 'New block rejected',
            newBlock: newBlock
        })
    }
})

export { nodeApi }