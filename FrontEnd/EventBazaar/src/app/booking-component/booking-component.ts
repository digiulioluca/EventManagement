import { Component, OnInit } from '@angular/core';
import { BookingService, ReservationDTO } from '../service/booking.service';
import { CommonModule } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking-component.html',
  styleUrls: ['./booking-component.css'],
  imports: [CommonModule]
})
export class BookingComponent implements OnInit {
  // Array per contenere le prenotazioni recuperate dall'API
  reservations: ReservationDTO[] = [];

  // Flag per mostrare lo stato di caricamento dei dati
  isLoading = true;

  // Messaggio di errore da mostrare all'utente in caso di problemi
  errorMessage = '';

  // Oggetto prenotazione attuale (non usato direttamente qui)
  reservation: ReservationDTO = {};

  // Iniezione dei servizi BookingService e Router
  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    // Recupera l'UUID dell'utente dal localStorage per identificare l'utente autenticato
    const uuid = localStorage.getItem('uuid');
    console.log('UUID dal localStorage:', uuid);

    if (uuid) {
      // Se l'UUID è presente, chiama il servizio per ottenere le prenotazioni di quell'utente
      this.bookingService.getReservationsByUser(uuid).pipe(
        // tap per loggare i dati ricevuti dal backend
        tap(data => console.log('Dati ricevuti dal backend:', data)),

        // catchError per gestire errori nella chiamata http
        catchError(err => {
          console.error('Errore durante la chiamata:', err);
          this.errorMessage = 'Errore nel recupero delle prenotazioni.';
          this.isLoading = false;  // Ferma lo stato di caricamento in caso di errore
          return EMPTY;  // Torna un observable vuoto per terminare la catena
        })
      ).subscribe({
        next: (data) => {
          // Quando arrivano i dati, li assegna alla variabile reservations e ferma il caricamento
          this.reservations = data;
          this.isLoading = false;
        }
      });
    } else {
      // Se non c'è l'UUID, mostra un messaggio di errore e ferma il caricamento
      this.errorMessage = 'Utente non autenticato. UUID mancante.';
      this.isLoading = false;
    }
  }

  // Metodo per cancellare una prenotazione dato il suo UUID
  removeReservation(uuid: string): void {
    // Controlla che ci sia una prenotazione selezionata, altrimenti esce
    if (!this.reservation) return;

    // Chiede conferma all'utente prima di procedere con la cancellazione
    const conferma = confirm('Sei sicuro di voler cancellare la prenotazione?');
    if (!conferma) return;

    // Chiama il servizio per cancellare la prenotazione
    this.bookingService.delete(uuid).subscribe({
      next: () => {
        alert('Prenotazione eliminata');
        // Ricarica la pagina per aggiornare la lista prenotazioni
        window.location.reload();
      },
      error: (err) => {
        console.error('Errore cancellazone', err);
      }
    });
  }
}
