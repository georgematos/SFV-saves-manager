import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import * as firebase from 'firebase/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public currentUserEmail: string;
  public modalForm: FormGroup;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.currentUserEmail = user.email;
      } else {
        console.log('User is not logged');
      }
    })
    this.modalForm = this.formBuilder.group({
      conta: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(60)
      ])]
    })
  }

  public save(): void {
    let account = new Account(this.modalForm.value.conta, null, null);
    this.firebaseService.createAccount(account)
      .then(() => {
        console.log('account created')
      });
  }

  public logout(): void {
    this.firebaseService.logout()
      .then(() => {
        this.router.navigate(['/']);
      });
  }

}
