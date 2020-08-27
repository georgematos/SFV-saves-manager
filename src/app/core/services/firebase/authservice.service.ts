import { Injectable } from '@angular/core'
import * as firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import { Observable, from } from 'rxjs';
import { exit } from 'process';
import { User } from "../../../models/user.model";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {

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
      console.error(error);
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
    } catch (error) {
      console.error(error);
    }
  }

  public isLoggedin(): boolean {

    if (this.token_id === undefined && localStorage.getItem('idToken') !== null) {
      this.token_id = localStorage.getItem('idToken');
    }

    this.token_id === undefined ? this.router.navigate(['/']) : exit;

    return this.token_id !== undefined;
  }

  public logout(): Observable<any> {
    try {
      return from(firebase.auth().signOut()
        .then(() => {
          localStorage.removeItem('idToken');
          this.token_id = undefined;
        }));
    } catch (error) {
      console.error(error)
    }
  }

}