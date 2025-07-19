import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { UserDTO } from '../model/userDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-component.html',
  styleUrls: ['./user-component.css'],
})

export class UserComponent implements OnInit {
  user: UserDTO | null = null;
  editableUser: UserDTO | null = null;
  isLoading = true;
  editMode = false;

   // Inietta UserService per chiamate HTTP e Router per reindirizzamenti
  constructor(private userService: UserService, private router: Router) {}

   // All'inizializzazione del componente, recupera i dati utente tramite UUID da localStorage
  ngOnInit(): void {
    const uuid = localStorage.getItem('uuid');
    // Se l'UUID non è presente, termina il caricamento senza chiamate
    if (!uuid) {
      this.isLoading = false;
      return;
    }
  // Recupera i dati utente dal backend tramite il servizio
    this.userService.getUserByUuid(uuid).subscribe({
      next: (res) => {
        this.user = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore utente', err);
        this.user = null;
        this.isLoading = false;
      }
    });
  }
// Abilita la modalità di modifica e copia i dati utente in editableUser
  enableEdit(): void {
    this.editMode = true;
    if (this.user) {
      this.editableUser = {
        uuid: this.user.uuid,
        name: this.user.name,
        email: this.user.email,
        role: this.user.role,
        password: this.user.password
      };
    }
  }
 // Annulla la modifica, ricaricando i dati originali dell'utente
  cancelEdit(): void {
    this.editMode = false;
    if (this.user) {
      this.editableUser = {
         uuid: this.user.uuid,
         name: this.user.name,
         email: this.user.email,
         role: this.user.role,
        password: this.user.password
        };
    }
  }
// Salva le modifiche apportate all'utente chiamando l'update nel backend
  saveEdit(): void {
    if (!this.editableUser || !this.user) return;

    this.userService.updateUser(this.user.uuid, this.editableUser).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.editMode = false;
      },
      error: (err) => {
        console.error('Errore salvataggio', err);
      }
    });
  }
// Cancella il profilo dell'utente dopo conferma, e reindirizza al login
  deleteProfile(): void {
    if (!this.user) return;

    const conferma = confirm('Sei sicuro di voler cancellare il tu profilo?');
    if (!conferma) return;

    this.userService.deleteUser(this.user.uuid).subscribe({
      next: () => {
        localStorage.removeItem('uuid');
        alert('Profilo eliminato');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Errore cancellazone', err);
      }
    });
  }
}
