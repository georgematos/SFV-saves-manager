import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { exit } from 'process';
import { Observable } from "rxjs";
import { Account } from '../../../models/account.model';
import { User } from "../../../models/user.model";

@Injectable()
export class FirebaseService {

  public signUpError: string;
  public authError: string;
  public token_id: string;

  constructor(
    private router: Router
  ) { }

  public async signup(user: User): Promise<any> {
    if (this.signUpError !== undefined) this.signUpError = undefined;
    try {
      await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((auth) => {
        delete user.password;
          firebase.database()
           .ref(`user_data/${auth.user.uid}`)
           .set(user);
      });
    } catch (error) {
      this.signUpError = error.message;
    }
  }

  public async login(email: string, password: string): Promise<any> {
    if (this.authError !== undefined) this.authError = undefined;
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      firebase.auth().currentUser.getIdToken()
        .then((idToken: string) => {
          this.token_id = idToken;
          localStorage.setItem('idToken', idToken);
        });
    }
    catch (error) {
      this.authError = error.message;
    }
  }

  public isLoggedin(): boolean {

    if (this.token_id === undefined && localStorage.getItem('idToken') !== null) {
      this.token_id = localStorage.getItem('idToken');
    }

    this.token_id === undefined ? this.router.navigate(['/']) : exit;

    return this.token_id !== undefined;
  }

  public createAccount(account: Account): Promise<any> {   
    try {
      return firebase.database().ref(`user_data/${firebase.auth().currentUser.uid}`)
        .push(account);
    } catch(error) {
      console.log(error);
    }
  }

  public async logout(): Promise<any> {
    try {
      await firebase.auth().signOut()
        .then(() => {
          localStorage.removeItem('idToken');
          this.token_id = undefined;
        });
    } catch (error) {
      console.log(error)
    }
  }
}