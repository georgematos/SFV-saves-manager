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
  public accountUpdatedEmitter = new EventEmitter();

  public selectedAccount: Account;

  public modalForm: FormGroup;
  public errorMessage: string;
  public title: string;
  public accountToModify: Account;

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
    if (this.modalForm.value.id) {
      this.updateAccount(this.accountToModify);
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
        this.verifyIfSteamUserExist(respFromSteam)
        this.steamService.getSteamUserData(respFromSteam.response.steamid)
          .subscribe((resp: any) => {
            let account = this.makeAccountObjectToCreation(resp, nickname, email)
            this.firebaseService.saveSteamAccount(account, gameProgressSave, gameSystemSave)
              .subscribe(
                () => {
                  this.selectedAccount.status = false;
                  this.updateAccount(this.selectedAccount);
                  this.ngOnInit();
                },
                (error) => {
                  this.errorMessage = error;
                }
              );
          });
      })
  }

  private verifyIfSteamUserExist(respFromSteam: any): void {
    this.errorMessage = '';
    if (!respFromSteam.response.steamid) {
      this.errorMessage = 'User not found';
      throw ('User not found');
    }
  }

  private makeAccountObjectToCreation(respFromSteam: any, nickname: string, email: string): Account {
    let account: Account;
    let p = respFromSteam.response.players[0];
    account = new Account(null, true, p.steamid, nickname, p.avatar, p.realname, email);
    return account;
  }

  public updateAccount(account: Account): void {
    account.nickname = this.selectedAccount ? this.selectedAccount.nickname : this.modalForm.value.nickname;
    account.email = this.selectedAccount ? this.selectedAccount.email : this.modalForm.value.email;
    this.firebaseService.updateSteamAccount(account)
      .subscribe(() => {
        $('.close').click(); // fecha o modal
        this.ngOnInit();
        this.accountUpdatedEmitter.emit(true);
      });
  }

  public resetModal(): void {
    this.ngOnInit();
  }

  public openInBrowser(link: string): void {
    this.electronService.openLinkExternal(link)
  }

}

