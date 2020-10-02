import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import { SteamService } from 'app/core/services/steam/steam.service';
import { User } from 'app/models/user.model';
import * as firebase from 'firebase/app';
import { from, pipe } from 'rxjs';
import { filter } from 'rxjs/operators'
import { ElectronService } from '../core/services/electron/electron.service'
import { AuthService } from '../core/services/firebase/authservice.service';
import { Account } from '../models/account.model';
import { AccountModalComponent } from './account-modal/account-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public currentUser: User = new User('', '', '', []);
  public accounts: Account[];
  public currentAccount: Account;
  public accountToDelete: Account;

  public successMsg = false;

  @ViewChild(AccountModalComponent)
  public accountModal: AccountModalComponent;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private steamService: SteamService,
    private authService: AuthService,
    private electronService: ElectronService
  ) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser.uid = user.uid;
        this.currentUser.email = user.email;
      } else {
        console.log('User is not logged');
      }
      this.fillAccounts();
    })
  }

  ngAfterViewInit() {
    console.log()
  }

  public fillAccounts(): void {
    this.accounts = [];
    this.firebaseService.getSteamAccounts(this.currentUser)
    .then((accounts: Array<Account>) => {
      this.accounts = accounts;
      this.currentAccount = this.accounts.find(x => x.status)
    })
  }

  public updateThisAccount(account: Account): void {
    this.steamService.getSteamUserData(account.steamId).subscribe((resp) => {
      resp.response.players.forEach((p: any) => {
        account.username = p.realname;
        account.avatarUrl = p.avatar;
      });
      this.firebaseService.updateSteamAccount(account);
    });
  }

  public manualBackup(account: Account): void {

    let gameSystemSave = this.electronService.ipcRenderer.sendSync('convertFileToBlob', 'GameSystemSave.sav');
    let gameProgressSave = this.electronService.ipcRenderer.sendSync('convertFileToBlob', 'GameProgressSave.sav');
    this.firebaseService.uploadSavesToStorage(this.currentUser.uid, account.steamId, new Blob([gameSystemSave]), new Blob([gameProgressSave]))
      .then((resp) => {
        this.successMsg = resp;
        setTimeout(() => {
          this.successMsg = false;
        }, 3000);
      })
  }

  public switchToThisAccount(account: Account, i: number): void {
    // obtem as versoes blob dos arquivos de save da conta atual para serem salvas no firebase

    let gameSystemSave = this.electronService.ipcRenderer.sendSync('convertFileToBlob', 'GameSystemSave.sav');
    let gameProgressSave = this.electronService.ipcRenderer.sendSync('convertFileToBlob', 'GameProgressSave.sav');

    // troca o status da conta atual para false e salva a conta e os saves
    this.currentAccount.status = false;
    this.firebaseService.updateSteamAccount(this.currentAccount);
    this.firebaseService.uploadSavesToStorage(this.currentUser.uid, this.currentAccount.steamId, new Blob([gameProgressSave]), new Blob([gameSystemSave]));

    // troca o status da conta desejada para true e salva a conta    
    account.status = true;
    this.firebaseService.updateSteamAccount(account)

    // obetem os arquivos do storage e salva no diretorio de saves do sfv
    this.firebaseService.downloadSaveFromStorage(this.currentUser.uid, account.steamId);

    this.ngOnInit();
  }

  public updateSteamAccount(account: Account) {
    this.firebaseService.updateSteamAccount(account);
    this.ngOnInit();
  }

  public setAccountToDelete(account: Account) {
    this.accountToDelete = account;
  }

  public confirmDeleteAccount(event: boolean) {
    if (event) {
      this.deleteSteamAccount(this.accountToDelete);
    }
  }

  public deleteSteamAccount(account: Account) {
    this.firebaseService.deleteSteamAccount(account).subscribe(() => {
      this.ngOnInit();
    });
  }

  public logout(): void {
    this.authService.logout()
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  public fillModalToUpdate(account: Account) {
    this.accountModal.modalForm.setValue({ id: account.id, nickname: account.nickname, email: account.email });
    this.accountModal.accountToModify = account;
    this.accountModal.title = "update"
  }

  public sendCurrentAccountToChild(): void {
    this.accountModal.selectedAccount = this.currentAccount;
  }

  public updatePageWhenUpdate(event: boolean) {
    if (event) {
      this.firebaseService.updateSteamAccount(this.currentAccount);
      this.ngOnInit();
    }
  }
}

$(document).ready(() => {
  $('#AccountModal').on('shown.bs.modal', () => {
    $('#nicknameInput').trigger('focus').trigger('click');
  })
})