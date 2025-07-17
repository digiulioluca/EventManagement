package it.profice.project.reservation_service.service;

import it.profice.project.event_service.dto.EventDTO;
import it.profice.project.event_service.exception.EventNotFoundException;
import it.profice.project.reservation_service.dto.ReservationDTO;
import it.profice.project.reservation_service.model.Reservation;
import it.profice.project.reservation_service.repository.ReservationRepository;
import it.profice.project.reservation_service.exception.ReservationNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    /**
     * Injection di ReservationRepository e WebClient.Builder
     */
    private final ReservationRepository reservationRepository;
    private final WebClient.Builder webClientBuilder;

    /**
     * Salvataggio di una nuova prenotazione. Dopo aver raccolto i dati dal controller,
     * vengono impostati i valori dell'uuid (randomicamente) e della data (data attuale)
     *
     * @param reservation dto object
     * @return ReservationDTO generato
     */
    @Override
    public ReservationDTO save(ReservationDTO reservation) {
        EventDTO event = webClientBuilder.build()
                .get()
                .uri("http://event-service/api/v1/events/{uuid}", reservation.getEventUuid())
                .retrieve()
                .bodyToMono(EventDTO.class)
                .block();

        if (event == null)
            throw new EventNotFoundException();

        event = webClientBuilder.build()
                .patch()
                .uri("http://event-service/api/v1/events/{uuid}", reservation.getEventUuid())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of("availableSeats", event.getAvailableSeats()-1))
                .retrieve()
                .bodyToMono(EventDTO.class)
                .block();

        reservation.setEventDate(event.getDate());
        reservation.setEventTitle(event.getTitle());
        reservation.setEventLocation(event.getLocation());
        reservation.setUuid(UUID.randomUUID().toString());
        reservation.setDate(LocalDate.now());
        return modelToDto(reservationRepository.save(dtoToModel(reservation)));
    }

    /**
     * Cancellazione della prenotazione.
     *
     * @param uuid della prenotazione da eliminare
     */
    @Override
    public void delete(String uuid) {
        Reservation reservation = reservationRepository.findByUuid(uuid)
                .orElseThrow(() -> new ReservationNotFoundException("Prenotazione con uuid " + uuid + " non trovata"));


        EventDTO event = webClientBuilder.build()
                .get()
                .uri("http://event-service/api/v1/events/{uuid}", reservation.getEventUuid())
                .retrieve()
                .bodyToMono(EventDTO.class)
                .block();


        event = webClientBuilder.build()
                .patch()
                .uri("http://event-service/api/v1/events/{uuid}", reservation.getEventUuid())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of("availableSeats", event.getAvailableSeats()+1))
                .retrieve()
                .bodyToMono(EventDTO.class)
                .block();


        reservationRepository.deleteById(reservation.getId());
    }

    /**
     * Ricerca delle prenotazioni effettuate da un singolo utente.
     *
     * @param userUuid dell'utente da ricercare
     * @return lista di prenotazioni effettuate
     */
    public List<ReservationDTO> findByUserUuid(String userUuid){
        return reservationRepository.findByUserUuid(userUuid)
                .stream()
                .map(this::modelToDto)
                .toList();
    }

    /**
     * Ricerca delle prenotazioni effettuate per un singolo evento.
     *
     * @param eventUuid dell'evento da ricercare
     * @return lista di prenotazioni effettuate
     */
    public List<ReservationDTO> findByEventUuid(String eventUuid){
        return reservationRepository.findByEventUuid(eventUuid)
                .stream()
                .map(this::modelToDto)
                .toList();
    }

    /**
     * Conversione da Reservation a ReservationDTO. Prima di passare alla costruzione
     * dell'oggetto attraverso il builder, viene richiamato il webClientBuilder per trovare
     * l'evento da cui prelevare i campi per il DTO e per aggiornare il counter del campo
     * availableSeats.
     *
     * @param reservation istanza dell'entità
     * @return ReservationDTO -> uuid, data, e nome, location e data dell'evento
     */
    private ReservationDTO modelToDto(Reservation reservation) {
        EventDTO event = webClientBuilder.build()
                .get()
                .uri("http://event-service/api/v1/events/{uuid}", reservation.getEventUuid())
                .retrieve()
                .bodyToMono(EventDTO.class)
                .block();

        return ReservationDTO.builder()
                .uuid(reservation.getUuid())
                .eventTitle(event.getTitle())
                .eventDate(event.getDate())
                .eventLocation(event.getLocation())
                .date(reservation.getDate())
                .build();
    }


    /**
     * Conversione da ReservationDTO a Reservation
     *
     * @param reservation dto
     * @return istanza dell'entità
     */
    private Reservation dtoToModel(ReservationDTO reservation){
        return Reservation.builder()
                .uuid(reservation.getUuid())
                .userUuid(reservation.getUserUuid())
                .eventUuid(reservation.getEventUuid())
                .date(reservation.getDate())
                .build();
    }
}
