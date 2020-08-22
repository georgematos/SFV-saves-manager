import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])]
    })
  }

  public login(): void {
    this.firebaseService.login(
      this.formLogin.value.email,
      this.formLogin.value.password
    )
    .then(() => {
      console.log("login success.")
    });
  }

}
