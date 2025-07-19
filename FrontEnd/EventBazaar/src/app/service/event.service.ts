import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDTO } from '../model/eventDTO';


@Injectable({
    providedIn: 'root'// Il servizio è disponibile a livello globale (singleton)
})

export class EventService {
    private apiUrl = 'http://localhost:8080/api/v1/events'; // URL base del backend eventi
    private url = ''; // Variabile d'appoggio per endpoint dinamici

    constructor(private http: HttpClient) { }
 /**
     * Salva un nuovo evento nel backend
     * @param newEvent oggetto contenente i dati dell'evento
     */
    save(newEvent: EventDTO): Observable<EventDTO> {
        return this.http.post<EventDTO>(`${this.apiUrl}`, newEvent);
    }

    /**
     * Recupera tutti gli eventi presenti
     */
    findAll(): Observable<EventDTO[]> {
        console.log('All events:', this.apiUrl);
        return this.http.get<EventDTO[]>(this.apiUrl);
    }

    /**
     * Ottiene tutti gli eventi creati da un utente specifico
     * @param userUuid UUID dell'utente
     */
    getEventsByUserUuid(userUuid: string): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`${this.apiUrl}/${userUuid}/events`);
    }
   /**
     * Recupera un singolo evento dato il suo UUID
     * @param uuid identificativo dell'evento
     */
    getEventByUuid(uuid: string) {
        return this.http.get<EventDTO>(`${this.apiUrl}/${uuid}`);
    }
  /**
     * Esegue una ricerca eventi sul backend, usando una lista di criteri
     * @param list lista di EventDTO da usare come filtri
     */
    searchEvents(list: EventDTO[]): Observable<EventDTO[]> {
        this.url = this.apiUrl+'/search';
        return this.http.post<EventDTO[]>(this.url, list);
    }
    /**
     * Aggiorna completamente un evento esistente
     * @param uuid identificativo dell'evento
     * @param event dati aggiornati dell'evento
     */
    update(uuid: string, event: EventDTO): Observable<EventDTO> {
        return this.http.put<EventDTO>(`${this.apiUrl}/${uuid}`, event);
    }

    /**
     * Aggiorna parzialmente un evento (solo alcuni campi)
     * @param uuid identificativo dell'evento
     * @param event oggetto con i campi da modificare
     */
    partialUpdate(uuid: string, event: EventDTO): Observable<EventDTO> {
        return this.http.patch<EventDTO>(`${this.apiUrl}/${uuid}`, event);
    }
   /**
     * Elimina un evento dal sistema
     * @param uuid identificativo dell'evento
     */
    delete(uuid: string): Observable<void>{
        return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
    }

    /**
     * Recupera gli eventi in programma per la settimana corrente
     */
    weeklyEvents(): Observable<EventDTO[]> {
        this.url = this.apiUrl+'/weekly';
        return this.http.get<EventDTO[]>(this.url);
    }
}
