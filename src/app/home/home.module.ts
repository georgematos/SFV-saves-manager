import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'app/core/services/firebase/auth-guard-service';
import { SharedModule } from 'app/shared/shared.module';
import { AccountModalModule } from './account-modal/account-modal.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AccountModalComponent } from './account-modal/account-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    AccountModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    AccountModalModule,
  ],
  providers: [
    AuthGuard,
  ]
})
export class HomeModule { }