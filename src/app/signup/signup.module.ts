import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';

import { SignupComponent } from './signup.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    SharedModule,
    SignupRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    FirebaseService
  ]
})
export class SignupModule {}
