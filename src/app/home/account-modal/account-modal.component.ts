import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import { Account } from 'app/models/account.model';
import * as $ from 'jquery';
import { SteamService } from 'app/core/services/steam/steam.service';

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
    private firebaseService: FirebaseService,
    private steamService: SteamService
  ) { }

  ngOnInit(): void {
    this.title = "create";
    this.modalForm = this.formBuilder.group({
        id: [''],
        nickname: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(60)
        ])],
        email: ['', Validators.compose([
          Validators.minLength(5),
          Validators.maxLength(60)
        ])]
    })
  }

  public save(): void {
    let id = this.modalForm.value.id;
    let nickname = this.modalForm.value.nickname;
    let email = this.modalForm.value.email;
    
    this.steamService.getSteamIdByUsername(this.modalForm.value.nickname)
    .subscribe((resp: any) => {
      console.log(resp);
        this.steamService.getSteamUserData(resp.response.steamid)
        .subscribe((resp) => {
          console.log(resp)
          resp.response.players.forEach((p: any) => {
            // update
            if(id) {
              let account = new Account(id, p.steamid, nickname, p.avatar, p.realname, email, null, null);
              this.firebaseService.updateSteamAccount(account)
                .subscribe(() => {
                  $('.close').click(); // fecha o modal
                  this.ngOnInit();
                  this.accountSavedEmitter.emit(true);
                });
            } else {
              // create
              let account = new Account(null, p.steamid, nickname, p.avatar, p.realname, email, null, null);
              this.firebaseService.createSteamAccount(account)
                .subscribe(() => {
                  this.ngOnInit();
                  this.accountSavedEmitter.emit(true);
                });
            }
          });
        })
      }
    );
  }

  public resetModal(): void {
    this.ngOnInit();
  }

  public showPopover(): void {
    $('#popover').click().toggle();
  }

}
