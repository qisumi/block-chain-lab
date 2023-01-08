import express from 'express'
import { serverLogger } from '../logger/Logger';
import { randomUUID } from 'crypto';
import { nodeApi } from './nodeApi';
import { networkApi } from './networkApi';
import { db, Qcoin } from '../Blockchain/Qcoin';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const port = process.argv[2];

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

app.use((req, res, next) => {
    db.set('chain', Qcoin.chain);
    db.set('pendingTransactions', Qcoin.pendingTransactions);
    db.set('networkNodes', [...Qcoin.networkNodes])
    db.sync()
    next()
})

app.listen(port, () => {
    serverLogger.info(`server start at http://localhost:${port}`);
    serverLogger.info(`uuid: ${nodeAddress}`);
})