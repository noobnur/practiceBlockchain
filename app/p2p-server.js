const WebSocket = require('ws')

const P2P_PORT = process.env.P2P_PORT || 5001 
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

// $ HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev

class P2pServer {
    constructor(blockchain) {
        this.blockchain = blockchain
        this.sockets = []
    }

    listen() {
        const server = new WebSocket.Server({ port: P2P_PORT })
        server.on('connection', socket => {this.connectSocket(socket)})

        this.connectToPeers(); // after we make a 'connection' to the server, we will connect to peers
        // each time a new peer comes in on connection, the instance of the P2pServer will fun the connectToO 

        console.log(`Listening for peer-to-peer connections on ${P2P_PORT}`)
    }

    connectToPeers() {
        peers.forEach( peer => {
            const socket = new WebSocket(peer)

            socket.on('open', () => this.connectSocket(socket))
            // for each peer, we make a new websocket at diff ports
            // and for each socket made we 'open' it and connect socket

        })
    }

    connectSocket(socket) {
        this.sockets.push(socket) // which adds in new sockets within the instantiated p2pserver's sockets array
        console.log('Socket connected')

        this.messageHandler(socket) // for each socket, we give it the message handling capabilities

        this.sendChain(socket) // and sends the latest chain 
    }

    messageHandler(socket) {
        socket.on('message', (message) => {
            const data = JSON.parse(message)
            console.log('data', data)

            this.blockchain.replaceChain(data)
            // each time the socket receives a message (which is the data), 
            // this blockchain will replace the chain in this blockchain
        })
    }

    syncChains() {
        this.sockets.forEach( socket =>  { this.sendChain(socket) }) 
    }

    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain))
    }
}

module.exports = P2pServer