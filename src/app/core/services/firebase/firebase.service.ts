import { Injectable } from "@angular/core";
import * as firebase from "firebase/app";
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage'
import { from, Observable } from "rxjs";
import { Account } from '../../../models/account.model';
import { User } from "../../../models/user.model";
import { ElectronService } from "../electron/electron.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class FirebaseService {

  constructor(
    private electronService: ElectronService,
    private http: HttpClient
  ) {}

  public saveSteamAccount(
    account: Account,
    gameProgressSave: Blob,
    gameSystemSave: Blob
  ): Observable<any> {
    let uid = firebase.auth().currentUser.uid;
    return from(this.accountExists(uid, account.steamId).then(
      (accountExists) => {
        if(!accountExists) {
          account.username === undefined ? account.username = 'false' : '';
          console.log(account);
            (firebase.database().ref(`user_data/${uid}/accounts`)
            .push(account, () => {
              console.log('Conta criada');
              // salva os saves no storage
              this.uploadSavesToStorage(uid, account.steamId, gameProgressSave, gameSystemSave);
            }))
        } else {
          throw ('This account already exists, try another');
        }
      }));
  }

  public uploadSavesToStorage(
    uid: string,
    steamId: string,
    gameProgressSave: Blob,
    gameSystemSave: Blob): Promise<boolean> {
      let success: Promise<boolean>;
      try {
        success = firebase.storage().ref(`user_data/${uid}/accounts/${steamId}/gameprogress`)
          .put(gameProgressSave).then(() => true, () => false);
        success = firebase.storage().ref(`user_data/${uid}/accounts/${steamId}/gamesystem`)
          .put(gameSystemSave).then(() => true, () => false);
        return success;
      } catch (error) {
        console.log(error)
      }
  }

  public downloadSaveFromStorage(uid: string, steamId: string) {
    this.downloadSaveAndWrite(uid, steamId, 'GameProgressSave.sav', 'gameprogress');
    this.downloadSaveAndWrite(uid, steamId, 'GameSystemSave.sav', 'gamesystem');
  }

  private downloadSaveAndWrite(uid: string, steamId: string, fileName: string, fileNameInStorage: string) {
    // busca a url para download
    firebase.storage().ref(`user_data/${uid}/accounts/${steamId}/${fileNameInStorage}`).getDownloadURL()
      .then((url) => {
        // faz o download do arquivo que está no storage
        this.http.get(url, {responseType: 'blob'}).subscribe((saveBlob) => {
          // converte o tipo blob para arrayBuffer e envia ao serviço apropriado
          // para ser gravado em disco
          saveBlob.arrayBuffer().then((arrayBuff) => {
            this.electronService.putFileToFolder(arrayBuff, fileName);
          })
        })
      });
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
        .orderByChild('steamId')
        .equalTo(steamId)
        .once("value", (snap) => {
          exists = snap.val() ? true : false;
        });
      return exists;
    } catch (error) {
      console.error(error);
    }
  }
}