import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import { Account } from 'app/models/account.model';
import * as $ from 'jquery';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss']
})
export class AccountModalComponent implements OnInit {

  @Output()
  public accountSavedEmitter = new EventEmitter();
  public modalForm: FormGroup;
  public title: string;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.title = "create";
    this.modalForm = this.formBuilder.group({
        id: [''],
        conta: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(60)
        ])],
        email: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(60)
        ])]
    })
  }

  public save(): void {
    let id = this.modalForm.value.id;
    let conta = this.modalForm.value.conta;
    let email = this.modalForm.value.email;
    // update
    if(this.modalForm.value.id) {
      let account = new Account(id, conta, email, null, null);
      this.firebaseService.updateSteamAccount(account)
        .subscribe(() => {
          $('.close').click(); // fecha o modal
          this.ngOnInit();
          this.accountSavedEmitter.emit(true);
        });
    } else {
      // create
      let account = new Account(null, conta, email, null, null);
      this.firebaseService.createSteamAccount(account)
        .subscribe(() => {
          this.ngOnInit();
          this.accountSavedEmitter.emit(true);
        });
    }
  }

  public resetModal(): void {
    this.ngOnInit();
  }

}
