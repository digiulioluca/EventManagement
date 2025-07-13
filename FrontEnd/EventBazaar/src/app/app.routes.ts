import { Routes } from '@angular/router';
import { RegisterComponent } from './register-component/register-component';
import { LoginComponent } from './login-component/login-component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' },
];
