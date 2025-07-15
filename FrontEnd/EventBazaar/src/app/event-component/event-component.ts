import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventCategory, EventDTO, EventService } from '../service/event.service';
import { DatePipe } from '@angular/common';
import { BookingService, RequestDTO } from '../service/booking.service';

@Component({
  selector: 'app-event',
  templateUrl: './event-component.html',
  styleUrls: ['./event-component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe]
})
export class EventComponent implements OnInit {
  eventForm!: FormGroup;
  events: EventDTO[] = [];
  searchExecuted = false;
  categoryOptions = Object.values(EventCategory);
  request: RequestDTO = {};

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    console.log(this.categoryOptions);
    this.eventForm = this.fb.group({
      title: [''],
      dateFrom: [''],
      dateTo: [''],
      location: [''],
      category: ['']
    });
  }

  onSubmit(): void {
    const form = this.eventForm.value;
    if (this.eventForm.valid && !this.areAllFieldsEmpty(form)) {

      this.eventService.searchEvents(form).subscribe({
        next: (res) => {
          this.events = res;
          this.searchExecuted = true;
        },
        error: (err) => console.error('Errore nella ricerca eventi:', err)
      });
    } else {
      this.eventService.findAll().subscribe({
        next: (res) => {
          this.events = res;
          this.searchExecuted = true;
        },
        error: (err) => console.error('Errore nella ricerca eventi:', err)
      });
    }
  }

  areAllFieldsEmpty(form: FormGroup): boolean {
    return Object.values(form).every(value => 
        value === null || value === undefined || value === ''
    );
}

  onSelectEvent(eventUuid: string): void {
    this.router.navigate(['/events', eventUuid]);
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