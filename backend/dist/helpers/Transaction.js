import { v4 } from "uuid";
export default class Transaction {
    constructor(amount, payer, payee) {
        this.amount = amount;
        this.payer = payer;
        this.payee = payee;
        this.valid = false;
        this.id = v4();
    }
    toString() {
        return JSON.stringify(this);
    }
}
;
