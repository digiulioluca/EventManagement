import { Routes } from '@angular/router';
import { RegisterComponent } from './register-component/register-component';
import { LoginComponent } from './login-component/login-component';
import { BookingComponent } from './booking-component/booking-component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'home', component: HomeComponent },
  // { path: 'profile', component: ProfileComponent },
  { path: 'reservation', component: BookingComponent },
  { path: '**', redirectTo: 'login' },
];
