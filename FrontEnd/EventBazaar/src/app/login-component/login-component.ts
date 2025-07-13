import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {
  form;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.http
      .post<{ token: string }>(
        'http://localhost:8080/api/v1/auth/login',
        this.form.value
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          alert('Accesso riuscito!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          alert('Errore: ' + (err.error?.message || 'Credenziali non valide'));
        },
      });
  }
}
