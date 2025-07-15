package it.profice.project.user_service.handler;

import it.profice.project.user_service.exception.LoginUnauthorizedException;
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

    /**
     * Gestore delle eccezioni per MethodArgumentNotValidException
     *
     * @param e eccezione MethodArgumentNotValidException intercettata
     * @return ResponseEntity<Map<String, Object>> risposta HTTP con status 400 e body JSON
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handlerMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        Map<String, Object> ret = getRet("400", e.getMessage());
        return new ResponseEntity<>(ret, HttpStatus.BAD_REQUEST);
    }

    /**
     * Gestore delle eccezioni per UserNotFoundException
     *
     * @param e eccezione UserNotFoundException intercettata
     * @return ResponseEntity<Map<String, Object>> risposta HTTP con status 404 e body JSON
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handlerUserNotFoundException(UserNotFoundException e) {
        Map<String, Object> ret = getRet("404", "User non trovato");
        return new ResponseEntity<>(ret, HttpStatus.NOT_FOUND);
    }

    /**
     * Gestore delle eccezioni per LoginUnauthorizedException
     *
     * @param e eccezione LoginUnauthorizedException intercettata
     * @return ResponseEntity<Map<String, Object>> risposta HTTP con status 401 e body JSON
     */
    @ExceptionHandler(LoginUnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handlerLoginUnauthorizedException(RuntimeException e){
        return new ResponseEntity<>(getRet("401", "Username o password errati"), HttpStatus.UNAUTHORIZED);
    }

    /**
     * Metodo privato per la restituzione di una mappa che verrà utilizzata nei singoli
    * metodi @ExceptionHandler
    *
    * @param errorCode -> codice dell'errore da gestire
    * @param errorMessage -> messaggio personalizzato per il JSON di risposta
    *
    * @return HashMap<String, Object> contenente timestamp, codice errore e messaggio
     *         che verrà serializzata come JSON di risposta in caso di eccezione
    * */
    private Map<String, Object> getRet(String errorCode, String errorMessage){
        Map<String, Object> ret = new HashMap<>();
        ret.put("timestamp", LocalDateTime.now());
        ret.put("error", errorCode);
        ret.put("message",errorMessage);
        return ret;
    }
}
