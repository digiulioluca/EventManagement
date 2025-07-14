import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from '../model/event';

@Component({
  selector: 'app-event-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-component.html',
  styleUrl: './event-component.css'
})
export class EventComponent {
  
  events: Event[] = [];
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  constructor() {
    afterNextRender(() => {
      this.showAll();
    });
  }


  showAll(): void {
    this.http.get<Event[]>('http://localhost:8080/api/v1/events')
      .subscribe({
        next: (res) => {
          this.events = [...res];
          console.log('Events loaded:', this.events);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  trackByEventId(index: number, event: Event): string {
    return event.uuid;
  }

  onEventSelected(event: Event) {
    this.router.navigate([`/${event.uuid}`]);
  }
}
