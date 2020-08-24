import { Account } from "./account.model";

export class User {
    constructor(
        public uid: string,
        public email: string,
        public password: string,
        public accounts: Array<Account>
    ) { }
}