package it.profice.project.reservation_service.handler;

import it.profice.project.reservation_service.exception.ReservationNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ReservationGlobalException {

    @ExceptionHandler(ReservationNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handlerReservationNotFoundException(ReservationNotFoundException e){
        Map<String, Object> ret = new HashMap<>();

        ret.put("timestamp", LocalDateTime.now());
        ret.put("error", "404");
        ret.put("message", "Prenotazione non trovata");

        return new ResponseEntity<>(ret, HttpStatus.BAD_REQUEST);
    }
}
