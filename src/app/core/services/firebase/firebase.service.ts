import { Injectable } from "@angular/core";
import * as firebase from "firebase/app";
import 'firebase/database';
import 'firebase/auth';
import { from, Observable } from "rxjs";
import { Account } from '../../../models/account.model';
import { User } from "../../../models/user.model";

@Injectable()
export class FirebaseService {

  public createSteamAccount(account: Account): Observable<any> {
    if(account.username === undefined) {
      account.username = 'false'
    }
    try {
      let uid = firebase.auth().currentUser.uid;
      return from(this.accountExists(uid, account.steamId).then((resp: any) => {
        if (!resp) {
          from(firebase.database()
            .ref(`user_data/${uid}/accounts`)
            .push(account));
        }
      }))
    } catch(error) {
      console.error(error);
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
      console.error(error);
    }
  }

  public getSteamAccounts(user: User): Observable<any> {
    try {
      return from(firebase.database()
        .ref(`user_data/${user.uid}/accounts`)
        .orderByKey()
        .once('value'));
    } catch(error) {
      console.error(error);
    }
  }

  public deleteSteamAccount(account: Account): Observable<any> {
    try {
      return from(firebase.database()
        .ref(`user_data/${firebase.auth().currentUser.uid}/accounts/${account.id}`)
        .remove());
    } catch(error) {
      console.error(error);
    }
  }

  public async accountExists(uid: string, steamId: string): Promise<any> {
    let exists: boolean;
    try {
      await firebase.database()
        .ref(`user_data/${uid}/accounts`)
        .orderByChild('steamId')
        .equalTo(steamId)
        .once("value", (snapshot) => {
          exists = snapshot.val() ? true : false;
        })
      return exists;
    } catch (error) {
      console.error(error);
    }
  }
}