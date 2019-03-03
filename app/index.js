const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('../blockchain')
const P2pServer = require('./p2p-server')
const Wallet = require('../wallet')
const TransactionPool = require('../wallet/transaction-pool')
const Miner = require('./miner')

const HTTP_PORT = process.env.HTTP_PORT || 3001
// eg. $HTTP_PORT=3002 npm run dev

const app = express()
app.use(bodyParser.json())

const bc = new Blockchain()
const wallet = new Wallet()
const tp = new TransactionPool()
const p2pServer = new P2pServer(bc, tp) // instantiate the p2pserver using the constructor and the first blockchain
const miner = new Miner(bc, tp, wallet, p2pServer)

app.get('/blocks', (req, res) => {
    res.json(bc.chain)
})

app.get('/mine-transactions', (req, res) => {
    const block = miner.mine()
    console.log(`New block added: ${block.toString()}`)
    res.redirect('/blocks')
})

app.post('/mine', (req,res) => {
    const block = bc.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)

    p2pServer.syncChains() // each time a new block is added to the chain, the server will sync with all the other servers
    res.redirect('/blocks')
})

app.get('/transactions', (req, res) => {
    res.json(tp.transactions)
})

app.post('/transact', (req,res) => {
    const { recipient, amount } = req.body
    transaction = wallet.createTransaction(recipient, amount, tp)
    p2pServer.broadcastTransaction(transaction)
    res.redirect('/transactions')
})

app.get('/public-key', (req,res) => {
    res.json({ publicKey: wallet.publicKey})
})

// req.body 
// {
// 	"recipient": "foo-4dr355",
// 	"amount":  50
// }

app.listen(HTTP_PORT, () => {console.log(`Listening on port ${HTTP_PORT}`)})

p2pServer.listen() // in a way, this starts it all. p2pserver will listen for a connection