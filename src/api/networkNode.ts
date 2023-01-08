import express from 'express'
import { serverLogger } from '../logger/Logger';
import { Blockchain } from '../Blockchain/Blockchain';
import { randomUUID } from 'crypto';
import { nodeApi } from './nodeApi';
import { networkApi } from './networkApi';
import { db } from '../Blockchain/Qcoin';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const port = process.argv[2];

const Qcoin: Blockchain = (() => {
    const chain = new Blockchain();
    if (db.has('chain') && db.has('pendingTransactions')) {
        chain.chain = db.get('chain');
        chain.pendingTransactions = db.get('pendingTransactions');
    } else {
        db.set('chain', chain.chain);
        db.set('pendingTransactions', chain.pendingTransactions);
    }
    return chain;
})()

const nodeAddress: string = (() => {
    if (db.has('nodeAddress')) {
        return db.get('nodeAddress')
    } else {
        let nodeAddress = randomUUID().split('-').join('');
        db.set('nodeAddress', nodeAddress)
        return nodeAddress;
    }
})();


app.get('/', (req, res) => {
    res.send('Hello! I\'m Qisumi.')
})

app.use(nodeApi)

app.use(networkApi)

app.listen(port, () => {
    serverLogger.info(`server start at http://localhost:${port}`);
    serverLogger.info(`uuid: ${nodeAddress}`);
})

process.on('exit', (code) => {
    console.log(`server exit with code: ${code}`);
    db.sync()
});

process.on('SIGINT', function () {
    process.exit(1);
});

process.on('SIGTERM', function () {
    process.exit(1);
});