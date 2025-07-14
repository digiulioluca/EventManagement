import { Routes } from '@angular/router';
import { RegisterComponent } from './register-component/register-component';
import { LoginComponent } from './login-component/login-component';
import { BookingComponent } from './booking-component/booking-component';
import { EventComponent } from './event-component/event-component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservations', component: BookingComponent },
  { path: '**', redirectTo: 'login' },
  { path: 'events', component: EventComponent},
  { path: '**', redirectTo: 'login' }
];
