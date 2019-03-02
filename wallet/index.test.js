const Wallet = require('./index')
const TransactionPool = require('./transaction-pool')

describe('Wallet test', () => {
    let wallet, tp
    
    beforeEach(() => {
        wallet = new Wallet()
        tp = new TransactionPool()
    })

    describe('creating a transaction', () => {
        let transaction, sendAmount, recipient

        beforeEach(() => {
            sendAmount = 50
            recipient = 'r4nd0m-4ddr355'
            transaction = wallet.createTransaction(recipient, sendAmount, tp);
        })

        // it('if we redo the same transaction, the update the transaction with an aditional output for the recipent of the transaction')
        
        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp)
            })

            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - sendAmount * 2)
            })

            it('clones the `sendAmount` output for the recipient', () => {
                expect(transaction.outputs.filter(output => output.address === recipient)
                .map(output => output.amount))
                .toEqual([sendAmount, sendAmount])
            })
        })
    })
})