import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from '../module/userDTO';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css']
})
export class NavbarComponent implements OnInit {
  userName: string | null = null;
  userRole: string | null = null;

get isLoggedIn(): boolean {
  return !!localStorage.getItem('uuid');
}


  constructor(private http: HttpClient) {}

  ngOnInit() {
    const uuid = localStorage.getItem('uuid');
    if (uuid) {
      this.http.get<UserDTO>(`/api/users/${uuid}`).subscribe({
        next: (user) => {
          this.userName = user.name;
          this.userRole = user.role;
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  get isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  logout(): void {
    localStorage.removeItem('uuid');
    window.location.href = '/';
  }
}
