import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterModule, NgIf],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css'
})
export class NavbarComponent {
get isLoggedIn(): boolean {
    return !!localStorage.getItem('uuid'); 
  }

  logout(): void {
    localStorage.removeItem('uuid'); 
    window.location.href = '/'; 
  }
}
