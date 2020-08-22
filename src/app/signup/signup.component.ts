import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../core/services/firebase/firebase.service';
import { User } from 'app/models/user.model';
import { Router } from '@angular/router';

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
    })
  }

  public signup(): void {
    let user = new User(this.formLogin.value.email, this.formLogin.value.password, []);
    this.firebaseService.signup(user).then(() => {
      if (this.firebaseService.signUpError === undefined) {
        this.router.navigate(['home']);
      }
    });
  }
}
