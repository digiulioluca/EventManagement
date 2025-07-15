import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EventDTO, EventService } from '../service/event.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { BookingService, RequestDTO } from '../service/booking.service';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {

  events: EventDTO[] = [];
  isLoading = true;
  errorMessage = '';
  private router = inject(Router);

  request: RequestDTO = {};

  constructor(private eventService: EventService, private bookingService: BookingService) {

  }

  ngOnInit(): void {
    this.showAll();
  }


  showAll(): void {
    this.eventService.weeklyEvents().pipe(
      tap(data => console.log('Dati ricevuti dal backend:', data)),
      catchError(err => {
        console.error('Errore durante la chiamata:', err);
        this.errorMessage = 'Errore nel recupero degli eventi.';
        this.isLoading = false;
        return EMPTY;
      })
    ).subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      }
    });
  }

  onReservationButton(eventSelectedUuid: string): void {
    if (this.isLoggedIn) {
      this.request = {
        eventUuid: eventSelectedUuid,
        userUuid: localStorage.getItem('uuid') || ''
      };

      this.bookingService.save(this.request).subscribe({
        next: () => {
          alert('Prenotazione avvenuta con successo!');
          this.router.navigate(['reservations']);
        },
        error: (err) => {
          alert('Errore nella prenotazione: ' + (err.error?.message || ''));
        }
      });
    } else {
      alert("Esegui il log in per prenotarti all'evento");
    }
  }

   get isLoggedIn(): boolean {
    return localStorage.getItem('uuid') !== null;
  }

  onEventSelected(event: EventDTO) {
    this.router.navigate([`events/${event.uuid}`]);
  }

 
}
