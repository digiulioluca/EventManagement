import { Routes } from '@angular/router';
import { RegisterComponent } from './register-component/register-component';
import { LoginComponent } from './login-component/login-component';
import { BookingComponent } from './booking-component/booking-component';
import { EventComponent } from './event-component/event-component';
import { AdminComponent } from './admin-component/admin-component';
import { UserComponent } from './user-component/user-component';
import { HomeComponent } from './home-component/home-component';
import { EventDetailsComponent } from './event-details-component/event-details-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservations', component: BookingComponent },
  { path: 'events', component: EventComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'user', component: UserComponent },
  { path: 'events/:uuid', component: EventDetailsComponent}
];
