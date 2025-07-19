import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from '../model/userDTO';
import { EventDetailsComponent } from '../event-details-component/event-details-component';
import { EventService } from '../service/event.service';
import { EventCategory, EventDTO } from '../model/eventDTO';

@Component({
  selector: 'app-admin-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css'
})
export class AdminComponent implements OnInit{

  events: EventDTO [] = [];
  event : EventDTO | null = null;
  isLoading = true;
  editMode = false;
  addMode = false;
  user: UserDTO | null = null;
  eventsState: boolean = true;
  utenteUuid: string | null = null;
  eventCategories = Object.values(EventCategory);
  addEventForm!: FormGroup;
  editEventForm!: FormGroup;
  showValidationErrors = false;
  private http = inject(HttpClient);
  todayString: string | null = null;

  constructor(private eventService: EventService, private router: Router, private fb: FormBuilder){}

  ngOnInit(): void {

     const uuid = localStorage.getItem('uuid');
     this.utenteUuid = localStorage.getItem('uuid');
     const today = new Date();
     this.todayString = today.toISOString().split('T')[0];

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
      this.editEventForm = this.fb.group({
        title: [this.event.title, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
        description: [this.event.description, [Validators.required, Validators.maxLength(100)]],
        date: [this.event.date, Validators.required],
        location: [this.event.location, Validators.required],
        totalSeats: [this.event.totalSeats, [Validators.required, Validators.min(100)]],
        availableSeats: [this.event.availableSeats],
        state: [this.event.state],
        eventCategory: [this.event.eventCategory, Validators.required],
        userUuid: [this.event.userUuid]
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;   
    this.showValidationErrors = false;
  }

  saveEdit(): void {
    this.showValidationErrors = true;

    if (!this.editEventForm.valid || !this.event) return;

    const formValue = this.editEventForm.value;

    const editableEvent: EventDTO = {
        uuid: this.event.uuid,
        title: formValue.title,
        description: formValue.description,
        date: formValue.date,
        location: formValue.location,
        totalSeats: formValue.totalSeats,
        availableSeats: formValue.availableSeats,
        state: formValue.state,
        eventCategory: formValue.eventCategory,
        userUuid: formValue.userUuid
    }

    this.eventService.update(this.event.uuid, editableEvent).subscribe({
      next: () => {
        this.editMode = false;
        this.event = null;
        this.editEventForm.reset();
        this.showEvent();
      },
      error: (err) => {
        console.error('Errore salvataggio', err);
      }
    });
  }

  deleteEvent(): void {
    this.showValidationErrors = false;
    if (!this.event) return;

    const conferma = confirm('Sei sicuro di voler cancellare l\'evento?');
    if (!conferma) return;

    this.eventService.delete(this.event.uuid).subscribe({
      next: () => {
        alert('Evento eliminato');
        this.editMode = false;
        this.event = null;
        this.showEvent();
      },
      error: (err) => {
        console.error('Errore cancellazone', err);
      }
    });
  }

   addEvent(): void {
    this.addMode = true;

      this.addEventForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        date: ['', Validators.required],
        location: ['', Validators.required],
        totalSeats: [100, [Validators.required, Validators.min(100)]],
        availableSeats: [0],
        state: [true],
        eventCategory: [EventCategory.EMPTY, Validators.required],
        userUuid: [this.utenteUuid]
      });
    };

  cancelAdd(): void {
    this.showValidationErrors = false;
    this.addMode = false;
  }

  saveNewEvent(): void {
    this.showValidationErrors = true;

    if(this.addEventForm.valid)
    {
      const formValue = this.addEventForm.value;

      const newEvent: EventDTO = {
        uuid: '',
        title: formValue.title,
        description: formValue.description,
        date: formValue.date,
        location: formValue.location,
        totalSeats: formValue.totalSeats,
        availableSeats: formValue.totalSeats,
        state: formValue.state,
        eventCategory: formValue.eventCategory,
        userUuid: formValue.userUuid
      };

      this.eventService.save(newEvent).subscribe({
        next: (res) => {
          this.events.push(res);
          this.addMode = false;
          this.addEventForm.reset();
          this.showValidationErrors = false;
        },
        error: (err) => {
          console.error('Errore creazione', err);
        }
      });
    }
  }

}
