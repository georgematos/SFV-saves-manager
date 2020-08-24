import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'app/models/user.model';
import { FirebaseService } from '../core/services/firebase/firebase.service';
import { ConfirmPasswordValidator } from '../validators/confirm-password.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.firebaseService.signUpError !== undefined) this.firebaseService.signUpError = undefined;
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])],
      controlPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])],
    },
      {
        validator: ConfirmPasswordValidator("password", "controlPassword")
      });
  }

  public signup(): void {
    let user = new User(null, this.formLogin.value.email, this.formLogin.value.password, []);
    this.firebaseService.signup(user).then(() => {      
      if (this.firebaseService.signUpError === undefined) {
        this.router.navigate(['/home']);
      }
    });
  }
}
