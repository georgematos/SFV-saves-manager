import { AccountData } from './account-data';
import { SaveDocument } from './save-document.model';

export class Account {

  public id: string;
  public status: boolean;
  public data: AccountData;
  public saveDocument: SaveDocument;

  constructor(
    id: string,
    status: boolean,
    steamId: string,
    nickname: string,
    avatar: string,
    realname: string,
    email: string,
    gameProgressSave: Blob,
    gameSystemSave: Blob
  ) {
    let accountData = new AccountData(steamId, nickname, avatar, realname, email);
    let saveDocument = new SaveDocument(gameProgressSave, gameSystemSave);

    this.id = id;
    this.status = status;
    this.data = accountData;
    this.saveDocument = saveDocument;
  }  
}