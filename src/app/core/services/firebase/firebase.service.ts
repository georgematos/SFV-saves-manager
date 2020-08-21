import { Injectable } from "@angular/core";
import { User } from "../../../models/user.model";
import * as firebase from "firebase/app";
import 'firebase/auth';

@Injectable()
export class FireBaseService {

  public signUpError: string;

  constructor() {}

  public async signup(user: User): Promise<any> {
    if (this.signUpError !== undefined) this.signUpError = undefined;
    try {
      await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((resp) => {
          console.log(resp);
        })
    } catch(error) {
      this.signUpError = error.message;
    }
  }
}