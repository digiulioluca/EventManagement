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

  events: EventDTO[] = []; // Lista di eventi da mostrare
  isLoading = true; // Stato di caricamento iniziale
  errorMessage = ''; // Messaggio di errore in caso di problemi
  private router = inject(Router); // Iniezione del router per navigazione

  request: RequestDTO = {}; // DTO usato per inviare la richiesta di prenotazione

  constructor(private eventService: EventService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.showAll(); // All'avvio del componente, carico gli eventi della settimana
  }

  showAll(): void {
    this.eventService.weeklyEvents().pipe(
      tap(data => console.log('Dati ricevuti dal backend:', data)), // Log dei dati ricevuti per debug
      catchError(err => {
        console.error('Errore durante la chiamata:', err); // Log errore
        this.errorMessage = 'Errore nel recupero degli eventi.'; // Messaggio da mostrare in UI
        this.isLoading = false;
        return EMPTY; // Evita il crash dello stream
      })
    ).subscribe({
      next: (data) => {
        this.events = data; // Popolo l'array eventi
        this.isLoading = false; // Caricamento completato
      }
    });
  }

  onReservationButton(eventSelectedUuid: string): void {
    if (this.isLoggedIn) {
      // Creo una richiesta di prenotazione se l'utente è loggato
      this.request = {
        eventUuid: eventSelectedUuid,
        userUuid: localStorage.getItem('uuid') || ''
      };

      this.bookingService.save(this.request).subscribe({
        next: () => {
          alert('Prenotazione avvenuta con successo!'); // Messaggio di successo
          this.router.navigate(['reservations']); // Reindirizzo alla pagina prenotazioni
        },
        error: (err) => {
          alert('Errore nella prenotazione: ' + (err.error?.message || '')); // Messaggio di errore
        }
      });
    } else {
      // L'utente non è loggato
      alert("Esegui il log in per prenotarti all'evento");
    }
  }

  get isLoggedIn(): boolean {
    // Controllo se l'utente ha fatto login
    return localStorage.getItem('uuid') !== null;
  }

  onEventSelected(event: EventDTO) {
    // Naviga alla pagina del dettaglio evento
    this.router.navigate([`events/${event.uuid}`]);
  }

}
