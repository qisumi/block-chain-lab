import express from 'express'

const app = express();

app.get('/',(req,res)=>{
    res.send('Hello! I\'m Qisumi.')
})

// fetch entire blockchain
app.get('/blockchain', function(req,res){

})

// create a new transaction
app.post('/transaction', function(req,res){
    
})

// mine a new block
app.get('/mine', function(req,res){
    
})

app.listen(3000,()=>{
    console.log('Listening on port 3000...');
})