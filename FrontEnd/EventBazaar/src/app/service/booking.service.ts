import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestDTO, ReservationDTO } from '../model/reservationDTO';


@Injectable({
  providedIn: 'root' // Rende il servizio disponibile globalmente (singleton)
})
export class BookingService {
  // URL base per tutte le chiamate al microservizio di prenotazione
  private apiUrl = 'http://localhost:8080/api/v1/reservations';

  constructor(private http: HttpClient) {}

  /**
   * Recupera tutte le prenotazioni di un utente specifico
   * @param userUuid UUID dell'utente
   * @returns Observable con array di ReservationDTO
   */
  getReservationsByUser(userUuid: string): Observable<ReservationDTO[]> {
    const url = `${this.apiUrl}/${userUuid}/user`;
    console.log('URL richiesta prenotazioni:', url); // Per debug
    return this.http.get<ReservationDTO[]>(url);
  }

  /**
   * Invia una nuova richiesta di prenotazione al backend
   * @param newReservation oggetto contenente UUID utente ed evento
   * @returns Observable con i dati della prenotazione creata
   */
  save(newReservation: RequestDTO): Observable<ReservationDTO> {
    return this.http.post<ReservationDTO>(`${this.apiUrl}`, newReservation);
  }

  /**
   * Cancella una prenotazione tramite il suo UUID
   * @param uuid identificativo della prenotazione da cancellare
   * @returns Observable che si completa una volta terminata l'eliminazione
   */
  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }
}
