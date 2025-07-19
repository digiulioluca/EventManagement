export interface EventDTO {
    uuid: string;              // Identificatore univoco dell'evento
    title: string;             // Titolo dell'evento
    date: Date;                // Data dell'evento
    location: string;          // Luogo in cui si tiene l'evento
    description: string;       // Descrizione dettagliata dell'evento
    totalSeats: number;        // Numero totale di posti disponibili
    availableSeats: number;    // Numero di posti ancora disponibili
    state: boolean;            // Stato dell'evento (attivo o no)
    eventCategory: EventCategory; // Categoria dell'evento (concerti, teatro, ecc.)
    userUuid: string;          // UUID dell'utente creatore dell'evento
}
/**
 * Enum che rappresenta le categorie disponibili per un evento
 */
export enum EventCategory {
    EMPTY = 'EMPTY',
    CONCERTS = 'CONCERTS',
    PLAY = 'PLAY',
    SPORTS = 'SPORT',
    EXHIBITIONS = 'EXHIBITIONS',
    OTHER = 'OTHER'
}
