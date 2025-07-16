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
  styleUrl: './admin-component.css'
})
export class AdminComponent implements OnInit{

  events: EventDTO [] = [];
  event : EventDTO | null = null;
  editableEvent: EventDTO | null = null;
  newEvent: EventDTO | null = null;
  isLoading = true;
  editMode = false;
  addMode = false;
  user: UserDTO | null = null;
  private http = inject(HttpClient);
  eventsState: boolean = true;
  utenteUuid: string | null = null;
  eventCategories = Object.values(EventCategory);


  constructor(private eventService: EventService, private router: Router){}

  ngOnInit(): void {

     const uuid = localStorage.getItem('uuid');
     this.utenteUuid = localStorage.getItem('uuid');
     console.log('UUID dal localStorage:', uuid);

     if (!uuid) {
      this.isLoading = false;
      return;
    }

      this.http.get<UserDTO>(`http://localhost:8080/api/v1/users/${uuid}`).subscribe({
        next: (res) => {
        this.user = res;
        if(this.user.role !== "ADMIN")
        {
            this.router.navigate(['/']);
        }
        this.isLoading = false;
        this.showEvent();
      },
      error: () => {this.isLoading= false}
     })


    }

    showEvent(): void{
      if(this.utenteUuid)
      {
        this.eventService.getEventsByUserUuid(this.utenteUuid).subscribe({
          next: (res) => {
            this.events = res;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }

  }

  selectEvent(event : EventDTO): void{
    this.event = event;
  }

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
        userUuid: this.event.userUuid
      };
    }
  }

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
        userUuid: this.event.userUuid
      };
    }
  }

  saveEdit(): void {
    if (!this.editableEvent || !this.event) return;

    this.eventService.update(this.event.uuid, this.editableEvent).subscribe({
      next: (updatedEvent) => {
        this.event = updatedEvent;
        this.editMode = false;
        this.event = null;
        this.showEvent();
      },
      error: (err) => {
        console.error('Errore salvataggio', err);
      }
    });
  }

  deleteEvent(): void {
    if (!this.event) return;

    const conferma = confirm('Sei sicuro di voler cancellare l\'evento?');
    if (!conferma) return;

    this.eventService.delete(this.event.uuid).subscribe({
      next: (res) => {
        alert('Evento eliminato');
        this.editMode = false;
        this.event = null;
        this.showEvent();
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Errore cancellazone', err);
      }
    });
  }

   addEvent(): void {
    this.addMode = true;
    if(this.utenteUuid)
    this.newEvent = {
      uuid: '',
      title: '',
      description: '',
      date: new Date(),
      location: '',
      totalSeats: 100,
      availableSeats: 0,
      state: true,
      eventCategory: EventCategory.EMPTY,
      userUuid: this.utenteUuid
    };
  }

  cancelAdd(): void {
    this.addMode = false;
  }

  saveNewEvent(): void {
    if(this.newEvent)
    {
      this.newEvent.availableSeats = this.newEvent.totalSeats;
      this.eventService.save(this.newEvent).subscribe({
        next: (res) => {
          this.events.push(res);
          this.addMode = false;
        },
        error: (err) => {
          console.error('Errore creazione', err);
        }
      });
    }
  }

}
