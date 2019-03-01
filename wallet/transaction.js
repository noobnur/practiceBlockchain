const ChainUtil = require('../chain-util')

class Transaction {
    constructor() {
        this.id = ChainUtil.id()
        this.input = null
        this.outputs = [] // 1. How much user wants to send 2.How much left after transaction
    }

    static newTransaction(senderWallet, recipient, amount) {
        const transaction = new this()
        // check balance if can do transaction

        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`)
            return
        }

        transaction.outputs.push(...[ //... spread operator. will push item by item in array
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipient }
        ])

        return transaction
    }
}

module.exports = Transaction