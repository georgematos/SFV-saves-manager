import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/services/firebase/authservice.service';
import { User } from 'app/models/user.model';
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
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.signUpError !== undefined) this.authService.signUpError = undefined;
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
    this.authService.signup(user).subscribe(
      () => {      
        if (this.authService.signUpError === undefined) {
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        this.authService.signUpError = error.message;
      });
  }
}
