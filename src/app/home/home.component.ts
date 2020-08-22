import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'app/core/services/firebase/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
  }

  public logout(): void {
    this.firebaseService.logout();
  }

}
