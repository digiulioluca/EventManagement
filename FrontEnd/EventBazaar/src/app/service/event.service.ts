import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventDTO {
    uuid: string,
    title: string,
    date: Date,
    location: string,
    description: string,
    totalSeats: number,
    availableSeats: number,
    state: boolean,
    eventCategory: EventCategory
}

export enum EventCategory {
    EMPTY = 'EMPTY',
    CONCERTS = 'CONCERTS',
    PLAY = 'PLAY',
    SPORTS = 'SPORTS',
    EXHIBITIONS = 'EXHIBITIONS',
    OTHER = 'OTHER'
}

@Injectable({
    providedIn: 'root'
})

export class EventService {
    private apiUrl = 'http://localhost:8080/api/v1/events';
    private url = '';

    constructor(private http: HttpClient) { }

    save(newEvent: EventDTO): Observable<EventDTO> {
        return this.http.post<EventDTO>(`${this.apiUrl}/${newEvent.uuid}`, newEvent);
    }

    findAll(): Observable<EventDTO[]> {
        console.log('All events:', this.apiUrl);
        return this.http.get<EventDTO[]>(this.apiUrl);
    }

    getEventByUuid(uuid: string) {
        return this.http.get<EventDTO>(`${this.apiUrl}/${uuid}`);
    }

    searchEvents(list: EventDTO[]): Observable<EventDTO[]> {
        this.url = this.apiUrl+'/search';
        return this.http.post<EventDTO[]>(this.url, list);
    }

    update(uuid: string, event: EventDTO): Observable<EventDTO> {
        return this.http.put<EventDTO>(`${this.apiUrl}/${uuid}`, event);
    }

    partialUpdate(uuid: string, event: EventDTO): Observable<EventDTO> {
        return this.http.patch<EventDTO>(`${this.apiUrl}/${uuid}`, event);
    }

    delete(uuid: string): void {
        this.http.delete(`${this.apiUrl}/${uuid}`);
    }
    
}