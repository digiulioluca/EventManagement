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
  // Form group per il form di ricerca eventi
  eventForm!: FormGroup;
  // Lista degli eventi da visualizzare
  events: EventDTO[] = [];
  // Flag per indicare se è stata eseguita una ricerca
  searchExecuted = false;
  // Array con tutte le opzioni di categoria evento (enum)
  categoryOptions = Object.values(EventCategory);
  // Oggetto per la prenotazione
  request: RequestDTO = {};

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    // Log delle categorie disponibili (debug)
    console.log(this.categoryOptions);
    // Inizializzazione del form con i campi di ricerca (tutti vuoti)
    this.eventForm = this.fb.group({
      title: [''],
      dateFrom: [''],
      dateTo: [''],
      location: [''],
      category: ['']
    });
  }

  // Metodo chiamato al submit del form di ricerca
  onSubmit(): void {
    const form = this.eventForm.value;
    // Se il form è valido e almeno un campo non è vuoto
    if (this.eventForm.valid && !this.areAllFieldsEmpty(form)) {
      // Effettua la ricerca filtrata tramite il service
      this.eventService.searchEvents(form).subscribe({
        next: (res) => {
          // Aggiorna la lista eventi con i risultati
          this.events = res;
          this.searchExecuted = true;
        },
        error: (err) => console.error('Errore nella ricerca eventi:', err)
      });
    } else {
      // Se il form è vuoto o non valido, recupera tutti gli eventi
      this.eventService.findAll().subscribe({
        next: (res) => {
          this.events = res;
          this.searchExecuted = true;
        },
        error: (err) => console.error('Errore nella ricerca eventi:', err)
      });
    }
  }

  // Metodo helper per verificare se tutti i campi del form sono vuoti
  areAllFieldsEmpty(form: any): boolean {
    return Object.values(form).every(value =>
      value === null || value === undefined || value === ''
    );
  }

  // Naviga alla pagina dettaglio evento selezionato
  onSelectEvent(eventUuid: string): void {
    this.router.navigate(['/events', eventUuid]);
  }

  // Metodo per prenotare un evento
  onReservationButton(eventSelectedUuid: string): void {
    if (this.isLoggedIn) {
      // Prepara la richiesta di prenotazione con UUID evento e utente
      this.request = {
        eventUuid: eventSelectedUuid,
        userUuid: localStorage.getItem('uuid') || ''
      };

      // Chiama il servizio di prenotazione
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
      // Se utente non loggato, mostra alert
      alert("Esegui il log in per prenotarti all'evento");
    }
  }

  // Getter per verificare se l'utente è loggato (presenza uuid in localStorage)
  get isLoggedIn(): boolean {
    return localStorage.getItem('uuid') !== null;
  }
}
