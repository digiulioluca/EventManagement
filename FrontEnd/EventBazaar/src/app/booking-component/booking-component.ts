import { Component, OnInit } from '@angular/core';
import { BookingService, ReservationDTO } from '../service/booking.service';
import { CommonModule } from '@angular/common';


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

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    const uuid = localStorage.getItem('uuid');
    console.log('Risposta del backend:', uuid);
    if (uuid) {
      this.bookingService.getReservationsByUser(uuid).subscribe({
        next: (data) => {
          this.reservations = data;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Errore nel recupero delle prenotazioni.';
          this.isLoading = false;
        },
      });
    } else {
      this.errorMessage = 'Utente non autenticato. UUID mancante.';
      this.isLoading = false;
    }
  }
}
