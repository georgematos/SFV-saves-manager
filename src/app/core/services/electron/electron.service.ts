import { Injectable } from '@angular/core';
import * as childProcess from 'child_process';
// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcMain, ipcRenderer, remote, webFrame, shell } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  ipcMain: typeof ipcMain;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  shell: typeof shell;
  fs: typeof fs;
  path: typeof path;

  public sfvSavesPathDir: string = 'AppData/Local/StreetFighterV/Saved/SaveGames';

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.ipcMain = window.require('electron').ipcMain;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.childProcess = window.require('child_process');
      this.shell = window.require('electron').shell;
      this.fs = window.require('fs');
      this.path = window.require('path');
    }
  }

  public openLinkExternal(link: string) {
    this.shell.openExternal(link);
  }
}
