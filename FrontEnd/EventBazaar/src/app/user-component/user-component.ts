import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { UserDTO } from '../module/userDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-component.html',
})

export class UserComponent implements OnInit {
  user: UserDTO | null = null;
  editableUser: UserDTO | null = null;
  isLoading = true;
  editMode = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const uuid = localStorage.getItem('uuid');

    if (!uuid) {
      this.isLoading = false;
      return;
    }

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