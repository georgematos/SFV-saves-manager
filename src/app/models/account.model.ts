import { AccountData } from './account-data';

export class Account {

  public id: string;
  public status: boolean;
  public data: AccountData;

  constructor(
    id: string,
    status: boolean,
    steamId: string,
    nickname: string,
    avatar: string,
    realname: string,
    email: string,
  ) {
    let accountData = new AccountData(steamId, nickname, avatar, realname, email);
    this.id = id;
    this.status = status;
    this.data = accountData;
  }  
}