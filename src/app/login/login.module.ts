import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LoginRoutingModule,
    ReactiveFormsModule,
  ],
  providers:[
    FirebaseService
  ]
})
export class LoginModule { }
