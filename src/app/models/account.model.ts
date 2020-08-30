export class Account {

  constructor(
    public id: string,
    public status: boolean,
    public steamId: string,
    public nickname: string,
    public avatarUrl: string,
    public username: string,
    public email: string,
  ) { }

}