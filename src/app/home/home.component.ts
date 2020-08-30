import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import { SteamService } from 'app/core/services/steam/steam.service';
import { User } from 'app/models/user.model';
import * as firebase from 'firebase/app';
import { Account } from '../models/account.model';
import { AccountModalComponent } from './account-modal/account-modal.component';
import { AuthService } from '../core/services/firebase/authservice.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  public currentUser: User = new User('', '', '', []);
  public accounts: Account[];
  public accountToDelete: Account;

  @ViewChild(AccountModalComponent)
  public accountModal: AccountModalComponent;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
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
      this.ngOnInit();
    }
  }

}

$(document).ready(() => {
  $('#AccountModal').on('shown.bs.modal', () => {
    $('#nicknameInput').trigger('focus').trigger('click');
  })
})