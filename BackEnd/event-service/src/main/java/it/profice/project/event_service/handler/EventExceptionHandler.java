package it.profice.project.event_service.handler;

import it.profice.project.event_service.exception.EventNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class EventExceptionHandler {
    private static Map<String, Object> getRet(String errorCode, String errorMessage) {
        Map<String, Object> ret = new HashMap<>();

        ret.put("timestamp", LocalDateTime.now());
        ret.put("error", errorCode);
        ret.put("message", errorMessage);
        return ret;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handlerMethodArgumentNotValidException(MethodArgumentNotValidException e){
        return new ResponseEntity<>(getRet("400", "si è presentato un errore di tipo MethodArgumentNotValidException"), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handlerEventNotFoundException(RuntimeException e){
        return new ResponseEntity<>(getRet("404", "Evento non presente sulla base dati"), HttpStatus.NOT_FOUND);
    }
}
