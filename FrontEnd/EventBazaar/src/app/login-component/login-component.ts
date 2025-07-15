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
  form; // proprietà che conterrà il FormGroup del form

  constructor(
    private fb: FormBuilder,   // costruttore FormBuilder per creare il form
    private http: HttpClient,  // per effettuare richieste HTTP
    private router: Router     // per reindirizzamenti
  ) {
    // Inizializzazione del form con i due campi richiesti
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],     // campo email con validazioni
      password: ['', Validators.required],                      // campo password richiesto
    });
  }

  // Metodo chiamato al submit del form
  submit() {
    if (this.form.invalid) return; // non invia se il form non è valido

    // Effettua una POST alla rotta di login con le credenziali
    this.http.post<{ uuid: string }>('http://localhost:8080/api/v1/auth/login', this.form.value)
      .subscribe({
        next: (res) => {
          // Salva l'UUID dell'utente nel localStorage
          localStorage.setItem('uuid', res.uuid);

          // Notifica e reindirizzamento
          alert('Accesso riuscito!');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          // Gestione errori di login
          alert('Errore: ' + (err.error?.message || 'Credenziali non valide'));
        },
      });
  }
}
