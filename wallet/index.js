const { INITIAL_BALANCE } = require('../config')
const Transaction = require('./transaction')
const ChainUtil = require('../chain-util')

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE
        this.keypair = ChainUtil.genKeyPair()
        this.publicKey = this.keypair.getPublic().encode('hex')
    }

    createTransaction(recipient, amount, transactionPool) {
        if (amount > this.balance) {
            console.log(`The amount: ${amount} exceeds the current balance: ${this.balance}`)
            return
        }

        let transaction = transactionPool.existingTransaction(this.publicKey)

        if (transaction) {
            transaction.update(this, recipient, amount)
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount)
            transactionPool.updateOrAddTransaction(transaction)
        }

        return transaction
    }

    toString() {
        return `Wallet - 
        balance   : ${this.balance},
        publicKey : ${this.publicKey.toString()}`
    }

    sign(dataHash) {
        return this.keypair.sign(dataHash)
    }
}

module.exports = Wallet