const ChainUtil = require('../chain-util')

const { DIFFICULTY, MINE_RATE } = require('../config')

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty || DIFFICULTY
    }
    
    toString() {
        return `Block - 
        Timestamp  : ${this.timestamp}
        Last Hash  : ${this.lastHash.substring(0,10)}
        Hash       : ${this.hash.substring(0,10)}
        Nonce      : ${this.nonce}
        Difficulty : ${this.difficulty}
        Data       : ${this.data}
        `
    }

    static genesis() {
        return new this('Genesis time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY)
    }

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        const lastHash = lastBlock.hash
        let { difficulty } = lastBlock
        let nonce = 0

        do {
            nonce++; // a nonce value is a unique number that can be used only once and will generate a unique hash
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty)
        } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty))

        return new this(timestamp, lastHash, hash, data, nonce, difficulty)

    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
    }

    static blockHash(block) {
        const {timestamp, lastHash, data, nonce, difficulty} = block
        return Block.hash(timestamp, lastHash, data, nonce, difficulty) 
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let {difficulty} = lastBlock
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1
        return difficulty
        // let's say the mine rate is 3 seconds. The do while happens like in milliseconds
        // if lastblock's timestamp plus 3 seconds is more than the currenttime (block was mined too slowly), the difficulty is lowered. 
        // this is to make sure that the amt of time needed to mine is not too far off from the Minerate that u want
        // the difficulty is dynamically adjusted 
    }
}

module.exports = Block;