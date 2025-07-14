import { Component, inject, OnInit } from '@angular/core';
import { EventDTO, EventService } from '../service/event.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-details-component',
  imports: [CommonModule],
  templateUrl: './event-details-component.html',
  styleUrl: './event-details-component.css'
})
export class EventDetailsComponent implements OnInit {

  eventUuid!: string | null;
  event!: EventDTO | null;

  private route = inject(ActivatedRoute);


  constructor(private eventService: EventService) {

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
}
