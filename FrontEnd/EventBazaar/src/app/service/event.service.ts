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
    CONCERTI,
    SPETTACOLI,
    SPORT,
    MOSTRE,
    ALTRO
}

@Injectable({
    providedIn: 'root'
})

export class EventService {
    private apiUrl = 'http://localhost:8080/api/v1/events';

    constructor(private http: HttpClient) { }

    findAll(): Observable<EventDTO[]> {
        console.log('All events:', this.apiUrl);
        return this.http.get<EventDTO[]>(this.apiUrl);
    }

    getEventByUuid(uuid: string) {
        return this.http.get<EventDTO>(`${this.apiUrl}/${uuid}`);
    }
}
