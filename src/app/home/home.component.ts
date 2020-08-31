import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import { SteamService } from 'app/core/services/steam/steam.service';
import { User } from 'app/models/user.model';
import * as firebase from 'firebase/app';
import { Account } from '../models/account.model';
import { AccountModalComponent } from './account-modal/account-modal.component';
import { AuthService } from '../core/services/firebase/authservice.service'
import { ElectronService } from 'app/core/services';
import { viewClassName } from '@angular/compiler';

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
    private electronService: ElectronService,
    private steamService: SteamService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.currentUser.uid = user.uid;
        this.currentUser.email = user.email;
        this.fillAccounts();
      } else {
        console.log('User is not logged');
      }
    })
  }

  ngAfterViewInit() {
    console.log()
  }

  public fillAccounts(): void {
    this.accounts = [];
    this.firebaseService.getSteamAccounts(this.currentUser)
    .subscribe((snapshot: any) => {
      snapshot.forEach((childOf: any) => {
        let account: Account = childOf.val();
        account.id = childOf.key;
        if (account.status) this.currentAccount = account;
        this.accounts.push(account);
      });
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
    let gameSystemSave = this.electronService.convertFileToBlob('GameSystemSave.sav');
    let gameProgressSave = this.electronService.convertFileToBlob('GameProgressSave.sav');
    this.firebaseService.uploadSavesToStorage(this.currentUser.uid, account.steamId, gameSystemSave, gameProgressSave)
      .then((resp) => {
        this.successMsg = resp;
        setTimeout(() => {
          this.successMsg = false;
        }, 3000);
      })
  }

  public switchToThisAccount(account: Account, i: number): void {
    // obtem as versoes blob dos arquivos de save da conta atual para serem salvas no firebase
    let gameSystemSave = this.electronService.convertFileToBlob('GameSystemSave.sav');
    let gameProgressSave = this.electronService.convertFileToBlob('GameProgressSave.sav');
    
    // troca o status da conta atual para false e salva a conta e os saves
    this.currentAccount.status = false;
    this.firebaseService.updateSteamAccount(this.currentAccount);
    this.firebaseService.uploadSavesToStorage(this.currentUser.uid, this.currentAccount.steamId, gameProgressSave, gameSystemSave);

    // troca o status da conta desejada para true e salva a conta    
    account.status = true;
    this.firebaseService.updateSteamAccount(account)

    // obetem os arquivos do storage e salver no diretorio de saves do sfv
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
    if(event) {
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
    this.accountModal.selectedAccount = account;
    this.accountModal.title="update"
  }

  public updatePage(event: boolean) {
    if(event) {
      this.currentAccount.status = false;
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