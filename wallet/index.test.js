const Wallet = require('./index')
const TransactionPool = require('./transaction-pool')
const Blockchain = require('../blockchain')
const {INITIAL_BALANCE} = require('../config')

describe('Wallet test', () => {
    let wallet, tp, bc
    
    beforeEach(() => {
        wallet = new Wallet()
        tp = new TransactionPool()
        bc = new Blockchain()
    })

    describe('creating a transaction', () => {
        let transaction, sendAmount, recipient

        beforeEach(() => {
            sendAmount = 50
            recipient = 'r4nd0m-4ddr355'
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        })

        // it('if we redo the same transaction, the update the transaction with an aditional output for the recipent of the transaction')
        
        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp)
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

    describe('calculating a balance', () => {
        let addBalance, repeatAdd, senderWallet
 
        beforeEach(() => {
            senderWallet = new Wallet()
            addBalance = 100
            repeatAdd = 3

            for(let i=0; i < repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp)
            }

            bc.addBlock(tp.transactions)
        })

        it('calculates the balance for blockchain matching the recipient', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd))
        })

        it('calculates the balance for blockchain transactions matching the sender', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd))
        })

        describe('the recipient now conducts a transaction', () => {
            let subtractBalance, recipentBalance

            beforeEach(() => {
                tp.clear()

                subtractBalance = 60
                recipentBalance = wallet.calculateBalance(bc)

                wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp)
                bc.addBlock(tp.transactions)
            })

            describe('sender sends another transaction to recipient', () => {
                beforeEach(() => {
                    tp.clear()
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp)
                    bc.addBlock(tp.transactions)
                })

                it('calculates the recipients balance using only transactions since its most recent ones', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipentBalance - subtractBalance + addBalance)
                })

            })
        })
    })
})