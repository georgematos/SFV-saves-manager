import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectronService } from 'app/core/services';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import { SteamService } from 'app/core/services/steam/steam.service';
import { Account } from 'app/models/account.model';
import * as $ from 'jquery';
import { SaveDocument } from 'app/models/save-document.model';

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
  public errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private steamService: SteamService,
    private electronService: ElectronService
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
    let gameSystemSave = this.electronService.getBlob('GameSystemSave.sav');
    let gameProgressSave = this.electronService.getBlob('GameProgressSave.sav');
    let saveDocument = new SaveDocument(gameProgressSave, gameSystemSave);

    this.steamService.getSteamIdByUsername(this.modalForm.value.nickname)
    .subscribe((respFromSteam: any) => {
      this.errorMessage = '';
      if(!respFromSteam.response.steamid) {
        this.errorMessage = 'User not found';
        throw('User not found');
      }
      this.steamService.getSteamUserData(respFromSteam.response.steamid)
      .subscribe((resp) => {
        resp.response.players.forEach((p: any) => {
          if(id) { // update
            console.log(p)
            let account = new Account(id, false, p.steamid, nickname, p.avatar, p.realname, email);
            this.firebaseService.saveSteamAccount(account, null)
              .subscribe(() => {
                this.updateDirName(this.modalForm.value.nickname, nickname);
                $('.close').click(); // fecha o modal
                this.ngOnInit();
                this.accountSavedEmitter.emit(true);
              });
            } else { // create
              let account = new Account(null, false, p.steamid, nickname, p.avatar, p.realname, email);
              this.firebaseService.saveSteamAccount(account, saveDocument)
              .subscribe((resp) => {
                this.createUserSteamBackupDir(nickname);
                this.ngOnInit();
                this.accountSavedEmitter.emit(true);
              });
          }
        });
      })
    });
  }

  public createUserSteamBackupDir(nickname: string): void {
    this.electronService.createBackupDir(nickname);
  }

  public updateDirName(nickname: string, newNickname: string) {
    this.electronService.updateBackupDirName(nickname, newNickname);
  }

  public resetModal(): void {
    this.ngOnInit();
  }

  public showPopover(): void {
    $('#popover').click().toggle();
  }

}
