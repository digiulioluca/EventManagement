import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventCategory, EventDTO, EventService } from '../service/event.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event',
  templateUrl: './event-component.html',
  styleUrls: ['./event-component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class EventComponent implements OnInit {
  eventForm!: FormGroup;
  events: EventDTO[] = [];
  searchExecuted = false;
  categoryOptions = Object.values(EventCategory);

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private http: HttpClient
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
}