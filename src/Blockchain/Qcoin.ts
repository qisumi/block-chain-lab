import { randomUUID } from "node:crypto";
import JSONdb from "simple-json-db";
import { Blockchain } from "./Blockchain";

const port = process.argv[2];

const db: JSONdb<any> = new JSONdb(`db/${port}.json`, {
    jsonSpaces: 2
});

const Qcoin: Blockchain = (() => {
    const chain = new Blockchain();

    if (db.has('chain') && db.has('pendingTransactions')) {
        chain.chain = db.get('chain');
        chain.pendingTransactions = db.get('pendingTransactions');
    } else {
        db.set('chain', chain.chain);
        db.set('pendingTransactions', chain.pendingTransactions);
    }

    if (db.has('networkNodes')) {
        chain.networkNodes = new Set(db.get('networkNodes'));
    } else {
        db.set('networkNodes', [...chain.networkNodes]);
    }
    return chain;
})()

function syncDb():void {
    db.set('chain', Qcoin.chain);
    db.set('pendingTransactions', Qcoin.pendingTransactions);
    db.set('networkNodes', [...Qcoin.networkNodes])
    db.sync()
} 

const nodeAddress: string = (() => {
    if (db.has('nodeAddress')) {
        return db.get('nodeAddress')
    } else {
        let nodeAddress = randomUUID().split('-').join('');
        db.set('nodeAddress', nodeAddress)
        return nodeAddress;
    }
})();

export { Qcoin, nodeAddress, db, syncDb }