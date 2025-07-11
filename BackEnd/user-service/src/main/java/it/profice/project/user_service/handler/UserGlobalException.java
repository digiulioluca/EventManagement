package it.profice.project.user_service.handler;

import it.profice.project.user_service.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class UserGlobalException {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handlerMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        Map<String, Object> ret = getRet("400", e.getMessage());
        return new ResponseEntity<>(ret, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handlerBookNotFoundException(UserNotFoundException e) {
        Map<String, Object> ret = getRet("404", e.getMessage());
        return new ResponseEntity<>(ret, HttpStatus.NOT_FOUND);
    }

    private Map<String, Object> getRet(String errorCode, String errorMessage){
        Map<String, Object> ret = new HashMap<>();
        ret.put("timestamp", LocalDateTime.now());
        ret.put("error", errorCode);
        ret.put("message",errorMessage);
        return ret;
    }
}
