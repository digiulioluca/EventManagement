package it.profice.project.event_service.repository;

import it.profice.project.event_service.model.Category;
import it.profice.project.event_service.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByUuid(String uuid);
    List<Event> findByUserUuid(String userUuid);
    @Query("""
    SELECT e FROM Event e WHERE
        (:title IS NULL OR TRIM(:title) = '' OR LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND
        (:dateFrom IS NULL OR e.date >= :dateFrom) AND
        (:dateTo IS NULL OR e.date <= :dateTo) AND
        (:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND
        (:category IS NULL OR e.eventCategory = :category)
    """)
    List<Event> searchEvents(
            @Param("title") String title,
            @Param("dateFrom") Date dateFrom,
            @Param("dateTo") Date dateTo,
            @Param("location") String location,
            @Param("category") Category category
    );

    @Query(value = """
    SELECT * FROM Event
    WHERE date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY)
    LIMIT 5
    """, nativeQuery = true)
    List<Event> findEventsNext7Days();
}
