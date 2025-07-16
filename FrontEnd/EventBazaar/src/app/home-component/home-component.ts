import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EventDTO, EventService } from '../service/event.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { BookingService, RequestDTO } from '../service/booking.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../service/user.service'; // Assicurati che questo tipo esista
import { UserDTO } from '../module/userDTO';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent implements OnInit {

  events: EventDTO[] = [];
  isLoading = true;
  errorMessage = '';

  userName: string | null = null;
  userRole: string | null = null;

  request: RequestDTO = {};

  constructor(
    private router: Router,
    private http: HttpClient,
    private eventService: EventService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.showAll();

    const uuid = localStorage.getItem('uuid');
    if (uuid) {
      this.http.get<UserDTO>(`http://127.0.0.1:8080/api/v1/users/${uuid}`).subscribe({
        next: (user) => {
          this.userName = user.name;
          this.userRole = user.role;
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  showAll(): void {
    this.eventService.weeklyEvents().pipe(
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

  onReservationButton(eventSelectedUuid: string): void {
    if (this.isLoggedIn) {
      this.request = {
        eventUuid: eventSelectedUuid,
        userUuid: localStorage.getItem('uuid') || ''
      };

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
      alert("Esegui il log in per prenotarti all'evento");
    }
  }

  onEventSelected(event: EventDTO) {
    this.router.navigate([`events/${event.uuid}`]);
  }

  getInterval(index: number): number {
    return index % 2 === 0 ? 10000 : 2000;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('uuid');
  }

  get isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
