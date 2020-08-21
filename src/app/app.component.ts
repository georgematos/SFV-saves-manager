import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import * as firebase from 'firebase/app';
import "firebase/auth";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('pt');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }

    const firebaseConfig = {
      apiKey: "AIzaSyDz0EMfsy1XmZwNQa2xg4rEdL7AuiH6yQk",
      authDomain: "sfv-saves-manager.firebaseapp.com",
      databaseURL: "https://sfv-saves-manager.firebaseio.com",
      projectId: "sfv-saves-manager",
      storageBucket: "sfv-saves-manager.appspot.com",
      messagingSenderId: "923011523319",
      appId: "1:923011523319:web:3e022326bc57a73e9c29f2",
      measurementId: "G-JWD2JW6WJR"
    };

    firebase.initializeApp(firebaseConfig);
  }
}
