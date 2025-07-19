import { Component, inject, OnInit } from '@angular/core';
import { EventService } from '../service/event.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../service/booking.service';
import { EventDTO } from '../model/eventDTO';
import { RequestDTO } from '../model/reservationDTO';

@Component({
  selector: 'app-event-details-component',
  imports: [CommonModule],
  templateUrl: './event-details-component.html',
  styleUrl: './event-details-component.css'
})
export class EventDetailsComponent implements OnInit {

  // UUID dell'evento passato tramite la route
  eventUuid!: string | null;

  // Dettagli dell'evento da mostrare
  event!: EventDTO | null;

  // Oggetto che rappresenta la richiesta di prenotazione
  request: RequestDTO = {};

  // Inietto il servizio di routing per accedere ai parametri dell'URL
  private route = inject(ActivatedRoute);

  constructor(
    private eventService: EventService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  // Metodo lifecycle eseguito all'inizializzazione del componente
  ngOnInit(): void {
    this.getEventByUuid(); // Recupera i dettagli dell'evento
  }

  // Recupera l'evento a partire dal suo UUID ottenuto dalla route
  getEventByUuid() {
    this.eventUuid = this.route.snapshot.paramMap.get('uuid');

    if (!this.eventUuid) {
      alert("UUID dell'evento non trovato");
      return;
    }

    this.eventService.getEventByUuid(this.eventUuid).subscribe({
      next: event => { this.event = event; }, // Salva i dati ricevuti
      error: () => { alert("Errore nel caricamento dell'evento"); } // Gestione errore
    });
  }

  // Metodo per prenotare un evento
  onReservationButton(eventSelectedUuid: string): void {
    if (this.isLoggedIn) {
      // Popola l'oggetto request con UUID evento e utente
      this.request = {
        eventUuid: eventSelectedUuid,
        userUuid: localStorage.getItem('uuid') || ''
      };

      // Invia la richiesta di prenotazione al servizio
      this.bookingService.save(this.request).subscribe({
        next: () => {
          alert('Prenotazione avvenuta con successo!');
          this.router.navigate(['reservations']); // Reindirizza alla pagina prenotazioni
        },
        error: (err) => {
          alert('Errore nella prenotazione: ' + (err.error?.message || ''));
        }
      });
    } else {
      // Utente non autenticato
      alert("Esegui il log in per prenotarti all'evento");
    }
  }

  // Getter per verificare se l'utente è loggato
  get isLoggedIn(): boolean {
    return localStorage.getItem('uuid') !== null;
  }
}
