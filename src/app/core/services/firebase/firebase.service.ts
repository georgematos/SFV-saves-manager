import { Injectable } from "@angular/core";
import { User } from "../../../models/user.model";
import * as firebase from "firebase/app";
import 'firebase/auth';
import { Router } from "@angular/router";
import { exit } from 'process';

@Injectable()
export class FireBaseService {

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
        .then((resp) => {
          console.log(resp);
        })
    } catch (error) {
      this.signUpError = error.message;
    }
  }

  public async login(email: string, senha: string): Promise<any> {
    if (this.authError !== undefined) this.authError = undefined;
    try {
      await firebase.auth().signInWithEmailAndPassword(email, senha);
      firebase.auth().currentUser.getIdToken()
        .then((idToken: string) => {
          this.token_id = idToken;
          localStorage.setItem('idToken', idToken);
          this.router.navigate(['/home']);
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

  public logout(): void {
    firebase.auth().signOut();
    localStorage.removeItem('idToken')
    this.token_id = undefined;
  }
}