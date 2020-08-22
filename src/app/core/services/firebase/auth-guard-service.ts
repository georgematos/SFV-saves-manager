import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private firebaseService: FirebaseService
    ) {}

    canActivate(): boolean {
        return this.firebaseService.isLoggedin();
    }

}