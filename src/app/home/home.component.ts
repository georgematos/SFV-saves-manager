import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public currentUserEmail: string;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.currentUserEmail = user.email;
      } else {
        console.log('User is not logged');
      }
    })
  }

  public logout(): void {
    this.firebaseService.logout()
      .then(() => {
        this.router.navigate(['/']);
      });
  }

}
