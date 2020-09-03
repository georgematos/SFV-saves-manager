import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectronService } from 'app/core/services/electron/electron.service';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import { SteamService } from 'app/core/services/steam/steam.service';
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
  public errorMessage: string;
  
  public title: string;
  public selectedAccount: Account;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private steamService: SteamService,
    private electronService: ElectronService
  ) { }

  ngOnInit(): void {
    this.title = "create";
    this.errorMessage = "";
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
    if(this.modalForm.value.id) {
      this.UpdateAccount(this.selectedAccount);
    } else {
      this.createAccount();
    }
  }

  public createAccount(): void {
    let nickname = this.modalForm.value.nickname;
    let email = this.modalForm.value.email;
    let gameSystemSave = this.electronService.ipcRenderer.sendSync('convertFileToBlob', 'GameSystemSave.sav');
    let gameProgressSave = this.electronService.ipcRenderer.sendSync('convertFileToBlob', 'GameProgressSave.sav');

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
          let account = new Account(null, false, p.steamid, nickname, p.avatar, p.realname, email);
          account.status = true;
          this.firebaseService.saveSteamAccount(account, gameProgressSave, gameSystemSave)
            .subscribe(
              () => {
                // this.createUserSteamBackupDir(nickname);
                this.ngOnInit();
                this.accountSavedEmitter.emit(true);
              }, 
              (error) => {
                this.errorMessage = error;
              }
            );
        });
      })
    });
  }

  public UpdateAccount(account: Account): void {
      this.selectedAccount.nickname = this.modalForm.value.nickname;
      this.selectedAccount.email = this.modalForm.value.email;
      this.firebaseService.updateSteamAccount(account)
        .subscribe(() => {
          // this.updateUserSteamBackupDir(this.modalForm.value.nickname, this.selectedAccount.nickname);
          $('.close').click(); // fecha o modal
          this.ngOnInit();
          this.accountSavedEmitter.emit(true);
        });
  }

  public resetModal(): void {
    this.ngOnInit();
  }

  public openInBrowser(link: string): void {
    this.electronService.openLinkExternal(link)
  }

  // public createUserSteamBackupDir(nickname: string): void {
  //   this.electronService.createBackupDir(nickname);
  // }

  // public updateUserSteamBackupDir(nickname: string, newNickname: string): void {
  //   this.electronService.updateBackupDirName(nickname, newNickname);
  // }
}

