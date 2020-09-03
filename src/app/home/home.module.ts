import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'app/core/services/firebase/auth-guard-service';
import { SharedModule } from 'app/shared/shared.module';
import { AccountModalComponent } from './account-modal/account-modal.component';
import { AccountModalModule } from './account-modal/account-modal.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SteamService } from '../core/services/steam/steam.service';
import { ConfirmationModalComponent } from 'app/confirmation-modal/confirmation-modal.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import { ElectronService } from 'app/core/services';

@NgModule({
  declarations: [
    HomeComponent,
    AccountModalComponent,
    ConfirmationModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    AccountModalModule,
    NgbModule,
  ],
  providers: [
    AuthGuard,
    SteamService,
    FirebaseService,
    ElectronService
  ]
})
export class HomeModule { }