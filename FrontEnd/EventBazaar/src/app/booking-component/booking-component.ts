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
  reservations: ReservationDTO[] = [];
  isLoading = true;
  errorMessage = '';
  reservation: ReservationDTO = {};

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    const uuid = localStorage.getItem('uuid');
    console.log('UUID dal localStorage:', uuid);
    if (uuid) {
      this.bookingService.getReservationsByUser(uuid).pipe(
        tap(data => console.log('Dati ricevuti dal backend:', data)),
        catchError(err => {
          console.error('Errore durante la chiamata:', err);
          this.errorMessage = 'Errore nel recupero delle prenotazioni.';
          this.isLoading = false;
          return EMPTY;
        })
      ).subscribe({
        next: (data) => {
          this.reservations = data;
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Utente non autenticato. UUID mancante.';
      this.isLoading = false;
    }
  }

  removeReservation(uuid: string): void {
    if (!this.reservation) return;

    const conferma = confirm('Sei sicuro di voler cancellare la prenotazione?');
    if (!conferma) return;

    this.bookingService.delete(uuid).subscribe({
      next: () => {
        alert('Prenotazione eliminata');
        window.location.reload();
      },
      error: (err) => {
        console.error('Errore cancellazone', err);
      }
    });
  }

}
