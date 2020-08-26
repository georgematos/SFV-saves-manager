import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';
import { exit } from 'process';
import { from, Observable } from "rxjs";
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

  public signup(user: User): Observable<any> {
    if (this.signUpError !== undefined) this.signUpError = undefined;
    try {
      return from(firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((auth) => {
        delete user.password;
          firebase.database()
           .ref(`user_data/${auth.user.uid}`)
           .set(user);
      }));
    } catch (error) {
      this.signUpError = error.message;
    }
  }

  public login(email: string, password: string): Observable<any> {
    if (this.authError !== undefined) this.authError = undefined;
    try {
      return from(firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        firebase.auth().currentUser.getIdToken()
          .then((idToken: string) => {
            this.token_id = idToken;
            localStorage.setItem('idToken', idToken)
          });
      }));
    } catch(error) {
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

  public createSteamAccount(account: Account): Observable<any> {
    if(account.username === undefined) {
      account.username = 'false'
    }
    try {
      return from(firebase.database()
      .ref(`user_data/${firebase.auth().currentUser.uid}/accounts`)
      .push(account));
    } catch(error) {
      console.log(error);
    }
  }

  public getSteamAccounts(user: User): Observable<any> {
    try {
      return from(firebase.database()
        .ref(`user_data/${user.uid}/accounts`)
        .orderByKey()
        .once('value'));
    } catch(error) {
      console.log(error);
    }
  }

  public updateSteamAccount(account: Account): Observable<any> {
    if(account.username === undefined) {
      account.username = 'false'
    }
    try {
      return from(firebase.database()
        .ref(`user_data/${firebase.auth().currentUser.uid}/accounts/${account.id}`)
        .update(account));
    } catch(error) {
      console.log(error);
    }
  }

  public deleteSteamAccount(account: Account): Observable<any> {
    try {
      return from(firebase.database()
        .ref(`user_data/${firebase.auth().currentUser.uid}/accounts/${account.id}`)
        .remove());
    } catch(error) {
      console.log(error);
    }
  }

  public logout(): Observable<any> {
    try {
      return from(firebase.auth().signOut()
        .then(() => {
          localStorage.removeItem('idToken');
          this.token_id = undefined;
        }));
    } catch (error) {
      console.log(error)
    }
  }
}