import express, { Router } from "express";
import { Qcoin } from "../Blockchain/Qcoin";

const networkApi: Router = express.Router()

// register a node and broadcast it the network
networkApi.post('/register-and-broadcast-node', (req, res) => {
    const { newNodeUrl } = req.body;
    if (!Qcoin.networkNodes.has(newNodeUrl)) {
        Qcoin.networkNodes.add(newNodeUrl);
    }

    Qcoin.networkNodes.forEach(networkNodeUrl => {

    })
})

// register a node with the network
networkApi.post('/register-node', (req, res) => {
    const { newNodeUrl } = req.body;
    if (!Qcoin.networkNodes.has(newNodeUrl)) {
        Qcoin.networkNodes.add(newNodeUrl);
    }

})

// register multiple nodes at once
networkApi.post('/register-nodes-bulk', (req, res) => {
    const { nodeList } = req.body;
    nodeList.array.forEach(nodeUrl => {
        Qcoin.networkNodes.add(nodeUrl)
    });
})

export { networkApi }