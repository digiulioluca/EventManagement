package it.profice.project.reservation_service.handler;

import it.profice.project.reservation_service.exception.ReservationNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ReservationGlobalException {

    /**
     * Gestore delle eccezioni per ReservationNotFoundExcpetion
     *
     * @param e eccezione ReservationNotFoundException intercettata
     * @return ResponseEntity<Map<String, Object>> risposta HTTP con status 404 e body JSON
     */
    @ExceptionHandler(ReservationNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handlerReservationNotFoundException(ReservationNotFoundException e){
        Map<String, Object> ret = new HashMap<>();
        ret.put("timestamp", LocalDateTime.now());
        ret.put("error", "404");
        ret.put("message", e.getMessage());
        return new ResponseEntity<>(ret, HttpStatus.NOT_FOUND);
    }

    /**
     * Gestore delle eccezioni per handleValidationExcpetion
     *
     * @param e eccezione MethodArgumentNotValidException intercettata
     * @return ResponseEntity<Map<String, Object>> risposta HTTP con status 400 e body JSON
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException e) {
        Map<String, Object> ret = new HashMap<>();
        ret.put("timestamp", LocalDateTime.now());
        ret.put("error", "400");

        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .orElse("Errore di validazione");

        ret.put("message", message);
        return new ResponseEntity<>(ret, HttpStatus.BAD_REQUEST);
    }
}
