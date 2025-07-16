package it.profice.project.reservation_service.exception;

public class ReservationNotFoundException extends RuntimeException {
    // classe per la gestione del codice 404
    public ReservationNotFoundException(String message) {
        super(message);
    }
}
