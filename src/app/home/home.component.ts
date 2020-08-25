import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import { User } from 'app/models/user.model';
import * as firebase from 'firebase/app';
import { Account } from '../models/account.model';
import { AccountModalComponent } from './account-modal/account-modal.component';

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
    this.firebaseService.getAccounts(this.currentUser).then((resp) => this.accounts = resp);
  }

  public updateAccount(account: Account) {
    this.firebaseService.update(account);
    this.ngOnInit();
  }

  public deleteAccount(account: Account) {
    this.firebaseService.deleteAccount(account);
    this.ngOnInit();
  }

  public logout(): void {
    this.firebaseService.logout()
      .then(() => {
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
