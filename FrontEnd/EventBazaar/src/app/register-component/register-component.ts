import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../model/userDTO';

@Component({
  selector: 'app-register', // Selettore del componente
  standalone: true,         // Componente standalone (senza NgModule)
  imports: [                // Moduli importati per funzionare
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register-component.html', // Template HTML associato
  styleUrls: ['./register-component.css']   // Foglio di stile associato
})
export class RegisterComponent {
  form: FormGroup; // Oggetto del form reattivo

  constructor(
    private fb: FormBuilder, // Per creare il form
    private http: HttpClient, // Per effettuare richieste HTTP
    private router: Router // Per la navigazione
  ) {
    // Inizializzazione del form con 3 campi: name, email, password
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Metodo chiamato al submit del form
   * Se il form è valido, invia i dati al backend per registrare l'utente
   */
  submit() {
    // Se il form è invalido, termina senza fare nulla
    if (this.form.invalid) return;

    // Effettua una POST alla rotta di registrazione del backend
    this.http.post<UserDTO>(
      'http://localhost:8080/api/v1/auth/register',
      this.form.value
    ).subscribe({
      // In caso di successo, mostra un messaggio e reindirizza alla home
      next: (res) => {
        alert('Registrazione avvenuta con successo!');
        this.router.navigate(['/']);
      },
      // In caso di errore, mostra un messaggio d'errore dettagliato
      error: (err) => {
        alert('Errore nella registrazione: ' + (err.error?.message || ''));
      }
    });
  }
}
