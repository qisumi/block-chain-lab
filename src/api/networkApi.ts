import express, { Router } from "express";
import fetch, { Response } from "node-fetch";
import { Blockchain } from "../Blockchain/Blockchain";
import { Qcoin } from "../Blockchain/Qcoin";
import { serverLogger } from "../logger/Logger";

const networkApi: Router = express.Router()

// register a node and broadcast it the network
networkApi.put('/register-and-broadcast-node', async (req, res) => {
    serverLogger.info(`broadcast api called`)
    const { newNodeUrl } = req.body;
    let regNodePromises: Promise<Response>[] = [];
    Qcoin.networkNodes.forEach(networkNodeUrl => {
        regNodePromises.push(fetch(networkNodeUrl + '/register-node', {
            method: "PUT",
            body: JSON.stringify({
                newNodeUrl: newNodeUrl
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        }
        ))
    })

    Promise.all(regNodePromises)
        .then(() => {
            const allNetworkNodes = new Set(Qcoin.networkNodes)
            allNetworkNodes.add(Qcoin.currentNodeUrl)
            return fetch(newNodeUrl + '/register-nodes-bulk', {
                method: "PUT",
                body: JSON.stringify({
                    allNetworkNodes: [...allNetworkNodes]
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        })
        .then(res => res.json())
        .then(() => {
            Qcoin.networkNodes.add(newNodeUrl);
            res.json({
                note: "New node registered with network successfully."
            })
        })
})

// register a node with the network
networkApi.put('/register-node', (req, res) => {
    serverLogger.info(`register api called`)
    const { newNodeUrl } = req.body;
    if (Qcoin.currentNodeUrl === newNodeUrl) {
        res.json({
            node: "invalid url."
        })
        return
    }
    Qcoin.networkNodes.add(newNodeUrl);
    res.json({
        note: "New node registered successfully with node."
    })
})

// register multiple nodes at once
networkApi.put('/register-nodes-bulk', (req, res) => {
    serverLogger.info(`bulk api called`)
    const { allNetworkNodes } = req.body;
    allNetworkNodes.forEach(nodeUrl => {
        if (nodeUrl !== Qcoin.currentNodeUrl)
            Qcoin.networkNodes.add(nodeUrl)
    });
    res.json({
        note: "register nodes bulk successfully"
    })
})

export { networkApi }