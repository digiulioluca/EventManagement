import { Routes } from '@angular/router';
import { RegisterComponent } from './register-component/register-component';
import { LoginComponent } from './login-component/login-component';
import { BookingComponent } from './booking-component/booking-component';
import { EventComponent } from './event-component/event-component';
import { UserComponent } from './user-component/user-component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservations', component: BookingComponent },
  { path: 'events', component: EventComponent},
  { path: 'user', component: UserComponent}
];
