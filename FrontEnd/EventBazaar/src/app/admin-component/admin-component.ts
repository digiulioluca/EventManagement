import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from '../module/userDTO';
import { EventCategory, EventDTO } from '../service/event.service';
import { EventDetailsComponent } from '../event-details-component/event-details-component';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css', // ATTENZIONE: deve essere "styleUrls" (plurale)
})
export class AdminComponent implements OnInit {
  // Lista degli eventi associati all'utente admin
  events: EventDTO[] = [];
  // Evento selezionato dall'utente
  event: EventDTO | null = null;
  // Evento in fase di modific
  editableEvent: EventDTO | null = null;
  // Nuovo evento in fase di creazione
  newEvent: EventDTO | null = null;
  // Stato di caricamento per mostrare spinner o messaggi
  isLoading = true;
  // Flag per la modalità modifica evento attiva
  editMode = false;
  // Flag per la modalità aggiunta nuovo evento attiva
  addMode = false;
  // Informazioni utente (admin) ottenute dal backend
  user: UserDTO | null = null;
  // Iniezione di HttpClient tramite inject (alternativa al costruttore)
  private http = inject(HttpClient);
  // Flag per la visualizzazione degli eventi
  eventsState: boolean = true;
  // UUID dell'utente ottenuto da localStorage
  utenteUuid: string | null = null;
  // Array con tutte le categorie eventi (enum)
  eventCategories = Object.values(EventCategory);

  // Iniezione dei servizi tramite costruttore
  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    // Recupera l'UUID dell'utente dal localStorage
    const uuid = localStorage.getItem('uuid');
    this.utenteUuid = uuid;
    console.log('UUID dal localStorage:', uuid);

    // Se non c'è UUID, termina caricamento
    if (!uuid) {
      this.isLoading = false;
      return;
    }

    // Recupera i dati dell'utente dal backend
    this.http
      .get<UserDTO>(`http://localhost:8080/api/v1/users/${uuid}`)
      .subscribe({
        next: (res) => {
          this.user = res;
          // Se l'utente non è admin, reindirizza alla home
          if (this.user.role !== 'ADMIN') {
            this.router.navigate(['/']);
          }
          this.isLoading = false;
          // Mostra gli eventi associati all'utente
          this.showEvent();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  // Metodo per caricare gli eventi dell'utente admin
  showEvent(): void {
    if (this.utenteUuid) {
      this.eventService.getEventsByUserUuid(this.utenteUuid).subscribe({
        next: (res) => {
          this.events = res;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  // Seleziona un evento dalla lista per visualizzarne i dettagli
  selectEvent(event: EventDTO): void {
    this.event = event;
  }

  // Attiva la modalità modifica e crea una copia dell'evento selezionato per la modifica
  enableEdit(): void {
    this.editMode = true;
    if (this.event) {
      this.editableEvent = {
        uuid: this.event.uuid,
        title: this.event.title,
        description: this.event.description,
        date: this.event.date,
        location: this.event.location,
        totalSeats: this.event.totalSeats,
        availableSeats: this.event.availableSeats,
        state: this.event.state,
        eventCategory: this.event.eventCategory,
        userUuid: this.event.userUuid,
      };
    }
  }

  // Annulla la modifica e resetta l'evento modificabile alla copia dell'evento originale
  cancelEdit(): void {
    this.editMode = false;
    if (this.event) {
      this.editableEvent = {
        uuid: this.event.uuid,
        title: this.event.title,
        description: this.event.description,
        date: this.event.date,
        location: this.event.location,
        totalSeats: this.event.totalSeats,
        availableSeats: this.event.availableSeats,
        state: this.event.state,
        eventCategory: this.event.eventCategory,
        userUuid: this.event.userUuid,
      };
    }
  }

  // Salva le modifiche apportate all'evento e aggiorna la lista
  saveEdit(): void {
    if (!this.editableEvent || !this.event) return;

    this.eventService.update(this.event.uuid, this.editableEvent).subscribe({
      next: (updatedEvent) => {
        this.event = updatedEvent;
        this.editMode = false;
        this.event = null;
        this.showEvent(); // Ricarica gli eventi aggiornati
      },
      error: (err) => {
        console.error('Errore salvataggio', err);
      },
    });
  }

  // Elimina l'evento selezionato dopo conferma
  deleteEvent(): void {
    if (!this.event) return;

    const conferma = confirm("Sei sicuro di voler cancellare l'evento?");
    if (!conferma) return;

    this.eventService.delete(this.event.uuid).subscribe({
      next: () => {
        alert('Evento eliminato');
        this.editMode = false;
        this.event = null;
        this.showEvent(); // Ricarica la lista eventi
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Errore cancellazione', err);
      },
    });
  }

  // Attiva la modalità per aggiungere un nuovo evento e inizializza un nuovo evento vuoto
  addEvent(): void {
    this.addMode = true;
    if (this.utenteUuid) {
      this.newEvent = {
        uuid: '',
        title: '',
        description: '',
        date: new Date(),
        location: '',
        totalSeats: 0,
        availableSeats: 0,
        state: true,
        eventCategory: EventCategory.EMPTY,
        userUuid: this.utenteUuid,
      };
    }
  }

  // Annulla la modalità aggiunta nuovo evento
  cancelAdd(): void {
    this.addMode = false;
  }

  // Salva il nuovo evento creato, aggiornando anche i posti disponibili e la lista eventi
  saveNewEvent(): void {
    if (this.newEvent) {
      // Disponibilità iniziale = posti totali
      this.newEvent.availableSeats = this.newEvent.totalSeats;
      this.eventService.save(this.newEvent).subscribe({
        next: (res) => {
          this.events.push(res); // Aggiunge l'evento alla lista
          this.addMode = false; // Esce dalla modalità aggiunta
        },
        error: (err) => {
          console.error('Errore creazione', err);
        },
      });
    }
  }
}
