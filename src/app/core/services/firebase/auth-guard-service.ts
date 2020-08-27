import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './authservice.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService
    ) {}

    canActivate(): boolean {
        return this.authService.isLoggedin();
    }

}