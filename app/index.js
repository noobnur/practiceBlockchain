const express = require('express')
const bodyParser = require('body-parser')
const Blockchain = require('../blockchain')
const P2pServer = require('./p2p-server')

const HTTP_PORT = process.env.HTTP_PORT || 3001
// eg. $HTTP_PORT=3002 npm run dev

const app = express()
app.use(bodyParser.json())

const bc = new Blockchain()
const p2pServer = new P2pServer(bc) // instantiate the p2pserver using the constructor and the first blockchain

app.get('/blocks', (req, res) => {
    res.json(bc.chain)
})

app.post('/mine', (req,res) => {
    const block = bc.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)

    p2pServer.syncChains() // each time a new block is added to the chain, the server will sync with all the other servers
    res.redirect('/blocks')
})

app.listen(HTTP_PORT, () => {console.log(`Listening on port ${HTTP_PORT}`)})

p2pServer.listen() // in a way, this starts it all. p2pserver will listen for a connection