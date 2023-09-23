import * as crypto from 'crypto';
import Transaction from './Transaction.js';
export default class Wallet {
    constructor(balance) {
        const keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        this.publicKey = keyPair.publicKey;
        this.privateKey = keyPair.privateKey;
        this.balance = balance;
    }
    send(amount, payeePublicKey) {
        if (amount > this.balance) {
            return "[insufficient balance]";
        }
        const transaction = new Transaction(amount, this.publicKey, payeePublicKey);
        const _sign = crypto.createSign('sha256');
        _sign.update(transaction.toString()).end();
        const sign = _sign.sign(this.privateKey);
        console.log(`Transaction (${transaction.id}) complete, still invalid`);
        return {
            transaction,
            sign
        };
    }
    ;
}
