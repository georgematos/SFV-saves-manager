import { Injectable } from "@angular/core";
import * as firebase from "firebase/app";
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage'
import { from, Observable } from "rxjs";
import { Account } from '../../../models/account.model';
import { User } from "../../../models/user.model";

@Injectable()
export class FirebaseService {

  public saveSteamAccount(
    account: Account,
    gameProgressSave: Blob,
    gameSystemSave: Blob
  ): Observable<any> {
    let uid = firebase.auth().currentUser.uid;
    return from(this.accountExists(uid, account.data.steamId).then(
      (accoutExist) => {
        if(!accoutExist) {
          account.data.username === undefined ? account.data.username = 'false' : '';
            (firebase.database().ref(`user_data/${uid}/accounts`)
            .push(account, () => {
              console.log('Conta criada');
              // salva os saves no storage
              // firebase.storage().ref(`user_data/${uid}/accounts/${account.data.steamId}/gameprogress`)
              //   .put(saveDocument.gameProgressSave);
              // firebase.storage().ref(`user_data/${uid}/accounts/${account.data.steamId}/gamesystem`)
              //   .put(saveDocument.gameSystemSave);
            }))
        } else {
          throw ('This account already exists, try another');
        }
      }));
  }

  public updateSteamAccount(account: Account): Observable<any> {
    let uid = firebase.auth().currentUser.uid;
    try {
      return from(firebase.database()
      .ref(`user_data/${uid}/accounts/${account.id}`)
      .update(account));
    } catch (error) {
      console.log(error);
    }
  }

  public getSteamAccounts(user: User): Observable<any> {
    try {
      return from(firebase.database()
        .ref(`user_data/${user.uid}/accounts`)
        .orderByChild('data')
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

  public async accountExists(uid: string, steamId: string): Promise<boolean> {
    let exists: boolean;
    try {
      await firebase.database()
        .ref(`user_data/${uid}/accounts`)
        .once("value", (snapshot) => {
          snapshot.forEach((childKey) => {
            exists = childKey.val().data.steamId === steamId ? true : false
          })
        })
        return exists;
    } catch (error) {
      console.error(error);
    }
  }
}