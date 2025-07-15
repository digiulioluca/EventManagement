package it.profice.project.user_service.repository;

import it.profice.project.user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // metodi personalizzati per l'implementazione del service
    Optional<User> findByUuid(String uuid);
    Optional<User> findByEmail(String email);
}

