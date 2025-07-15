import { CommonModule } from '@angular/common';
import { Component, inject, OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EventDTO, EventService } from '../service/event.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {

    events: EventDTO[] = [];
    isLoading = true;
    errorMessage = '';
    private router = inject(Router);

    constructor(private eventService: EventService) {

    }

    ngOnInit(): void {
      this.showAll();
    }


    showAll(): void {
      this.eventService.findAll().pipe(
              tap(data => console.log('Dati ricevuti dal backend:', data)),
              catchError(err => {
                console.error('Errore durante la chiamata:', err);
                this.errorMessage = 'Errore nel recupero degli eventi.';
                this.isLoading = false;
                return EMPTY;
              })
            ).subscribe({
              next: (data) => {
                this.events = data;
                this.isLoading = false;
              }
            });
    }

    eventSearch(): void {

    }

    onEventSelected(event: EventDTO) {
      this.router.navigate([`events/${event.uuid}`]);
    }
}
