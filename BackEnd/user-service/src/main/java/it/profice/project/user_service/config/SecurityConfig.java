package it.profice.project.user_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    /**
     * All'interno della nostra app, l'oggetto ritornato da questo metodo ci permetterà di
    * criptare la password in fase di registrazione di un nuovo utente, creando una stringa
    * criptata che sostituirà la password ricevuta dal client.
    *
    *  @return new BCryptPasswordEncoder */
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
