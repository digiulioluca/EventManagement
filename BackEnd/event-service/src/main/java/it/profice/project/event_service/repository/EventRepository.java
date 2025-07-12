package it.profice.project.event_service.repository;

import it.profice.project.event_service.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByUuid(String uuid);
    List<Event> findByUserUuid(String userUuid);
}
