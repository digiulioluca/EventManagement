import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register-component.html',
})
export class RegisterComponent {
  form;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['USER'],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.http.post('http://localhost:8081/api/v1/auth"', this.form.value)
      .subscribe({
        next: () => {
          alert('Registrazione riuscita!');
          this.router.navigate(['/login']);
        },
        error: err => alert('Errore: ' + err.error.message),
      });
  }
}
