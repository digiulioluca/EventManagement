import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../module/userDTO';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css'],
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.http.post<UserDTO>('http://localhost:8080/api/v1/auth/register', this.form.value)
      .subscribe({
        next: (res) => {
          localStorage.setItem('userUuid', res.uuid);
          alert('Registrazione avvenuta con successo!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          alert('Errore nella registrazione: ' + (err.error?.message || ''));
        }
      });
  }
}
