package it.profice.project.reservation_service.repository;

import it.profice.project.reservation_service.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // metodi personalizzati JPA
    Optional<Reservation> findByUuid(String uuid);
    List<Reservation> findByUserUuid(String userUuid);
    List<Reservation> findByEventUuid(String eventUuid);
}
