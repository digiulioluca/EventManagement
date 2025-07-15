import { Component, inject, OnInit } from '@angular/core';
import { EventDTO, EventService } from '../service/event.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, RequestDTO } from '../service/booking.service';

@Component({
  selector: 'app-event-details-component',
  imports: [CommonModule],
  templateUrl: './event-details-component.html',
  styleUrl: './event-details-component.css'
})
export class EventDetailsComponent implements OnInit {

  eventUuid!: string | null;
  event!: EventDTO | null;
  request: RequestDTO = {};
  private route = inject(ActivatedRoute);


  constructor(private eventService: EventService,
    private bookingService: BookingService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.getEventByUuid();
  }

  getEventByUuid() {
    this.eventUuid = this.route.snapshot.paramMap.get('uuid');

    if (!this.eventUuid) {
      alert("UUID dell'evento non trovato");
      return;
    }

    this.eventService.getEventByUuid(this.eventUuid).subscribe({
      next: event => { this.event = event; },
      error: () => { alert("Errore nel caricamento dell'evento"); }
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
}
