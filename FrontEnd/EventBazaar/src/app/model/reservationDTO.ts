/**
 * DTO per rappresentare una prenotazione restituita dal backend
 */
export interface ReservationDTO {
  uuid?: string;            // UUID della prenotazione (opzionale)
  eventLocation?: string;   // Luogo dell'evento
  eventTitle?: string;      // Titolo dell'evento
  eventDate?: string;       // Data dell'evento come stringa
  date?: Date;              // Data di prenotazione o altro scopo (opzionale)
}

/**
 * DTO per rappresentare una richiesta di prenotazione inviata al backend
 */
export interface RequestDTO {
  eventUuid?: string;       // UUID dell'evento da prenotare
  userUuid?: string;        // UUID dell'utente che prenota
}