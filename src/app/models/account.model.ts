export class Account {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public gameProgressSave: any,
    public gameSystemSave: any
  ) { }
}