package it.profice.project.event_service.handler;

import it.profice.project.event_service.exception.EventNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class EventExceptionHandler {

    /**
     * Metodo privato per la restituzione di una mappa che verrà utilizzata nei singoli
     * metodi @ExceptionHandler
     *
     * @param errorCode codice di errore
     * @param errorMessage messaggio di errore
     * @return Mappa con le risposte di errore
     */
    private static Map<String, Object> getRet(String errorCode, String errorMessage) {
        Map<String, Object> ret = new HashMap<>();

        ret.put("timestamp", LocalDateTime.now());
        ret.put("error", errorCode);
        ret.put("message", errorMessage);
        return ret;
    }

    /**
     * Gestore delle eccezioni per MethodArgumentNotValidException
     *
     * @param e eccezione MethodArgumentNotValidException
     * @return  Risposta HTTP con status 400 e messaggio di errore
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handlerMethodArgumentNotValidException(MethodArgumentNotValidException e){
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : e.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = getRet("400", "Errore di validazione");
        body.put("errors", fieldErrors);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * Gestore delle eccezioni per EventNotFoundException
     *
     * @param e eccezione UserNotFoundException
     * @return Risposta HTTP con status 404 e messaggio di errore
     */
    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handlerEventNotFoundException(RuntimeException e){
        return new ResponseEntity<>(getRet("404", "Evento non presente sulla base dati"), HttpStatus.NOT_FOUND);
    }
}
