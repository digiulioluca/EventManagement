package it.profice.project.auth_service.repository;

import it.profice.project.user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSecurityRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
