export interface Event {
    uuid: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    totalSeats: number;
    availableSeats: number;
    state: false;
    eventCategory: EventCategory;
}
export const defaultBeer: Event = {
    uuid: '',
    title: '',
    description: '',
    date: new Date('2025-01-01'),
    location: '',
    totalSeats: 0,
    availableSeats: 0,
    state: false,
    eventCategory: 0
}

export enum EventCategory {
    CONCERTS,
    PLAY,
    SPORT,
    EXHIBITIONS,
    OTHER
}