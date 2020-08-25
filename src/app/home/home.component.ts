import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import { Account } from '../models/account.model';
import { AccountModalComponent } from './account-modal/account-modal.component';
import { User } from 'app/models/user.model';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  public currentUser: User = new User('', '', '', []);
  public accounts: Account[] = [];

  @ViewChild(AccountModalComponent)
  public accountModal: AccountModalComponent;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
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

  public updateSteamAccount(account: Account) {
    this.firebaseService.updateSteamAccount(account);
    this.ngOnInit();
  }

  public deleteAccount(account: Account) {
    this.firebaseService.deleteSteamAccount(account).subscribe(() => {
      this.ngOnInit();
    });
  }

  public logout(): void {
    this.firebaseService.logout()
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  public fillModalToUpdate(account: Account) {
    this.accountModal.modalForm.setValue({ conta: account.username, id: account.id });
    this.accountModal.title="update"
  }

  public updatePage(event: boolean) {
    if(event) {
      this.ngOnInit();
    }
  }

}
