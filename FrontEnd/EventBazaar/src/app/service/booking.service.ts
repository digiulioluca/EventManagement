import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationDTO {
  eventLocation: string;
  eventTitle: string;
  eventDate: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/v1/reservations';

  constructor(private http: HttpClient) { }

  getReservationsByUser(userUuid: string): Observable<ReservationDTO[]> {
    const url = `${this.apiUrl}/${userUuid}/user`;
    console.log('URL richiesta prenotazioni:', url);
    return this.http.get<ReservationDTO[]>(url);
  }

  save(newReservation: ReservationDTO): Observable<ReservationDTO> {
    return this.http.post<ReservationDTO>(`${this.apiUrl}`, newReservation);
  }
}
