import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { AuthGuard } from 'app/core/services/firebase/auth-guard-service';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    HomeRoutingModule,
  ],
  providers: [
    AuthGuard
  ]
})
export class HomeModule { }