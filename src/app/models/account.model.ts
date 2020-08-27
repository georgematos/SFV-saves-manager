export class Account {
  constructor(
    public id: string,
    public steamId: string,
    public nickname: string,
    public avatarUrl: string,
    public username: string,
    public email: string,
    public status: boolean,
    public gameProgressSave: any,
    public gameSystemSave: any
  ) { }
}