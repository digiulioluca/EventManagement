import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from '../model/userDTO';
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
    // Nome e ruolo dell'utente loggato
  userName: string | null = null;
  userRole: string | null = null;

  // Getter per verificare se l'utente è loggato (presenza dell'UUID nel localStorage)
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('uuid');
  }

  constructor(private http: HttpClient) {}
  /**
   * All'avvio del componente, se presente un UUID salvato,
   * effettua una chiamata al backend per ottenere i dati utente.
   */
  ngOnInit() {
    const uuid = localStorage.getItem('uuid');
    if (uuid) {
      this.http
        .get<UserDTO>(`http://localhost:8080/api/v1/users/${uuid}`)
        .subscribe({
          next: (user) => {
            // Salva nome e ruolo utente per mostrarli nella navbar
            this.userName = user.name;
            this.userRole = user.role;
          }, // In caso di errore, effettua il logout forzato
          error: () => {
            this.logout();
          },
        });
    }
  }
// Getter per verificare se l'utente è un amministratore
  get isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }
  /**
   * Rimuove l'UUID dal localStorage e reindirizza alla home
   */
  logout(): void {
    localStorage.removeItem('uuid');
    window.location.href = '/';
  }
}
