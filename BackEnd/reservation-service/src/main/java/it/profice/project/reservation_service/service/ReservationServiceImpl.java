package it.profice.project.reservation_service.service;

import it.profice.project.event_service.dto.EventDTO;
import it.profice.project.reservation_service.config.WebClientBuilderConfig;
import it.profice.project.reservation_service.dto.ReservationDTO;
import it.profice.project.reservation_service.model.Reservation;
import it.profice.project.reservation_service.repository.ReservationRepository;
import it.profice.project.reservation_service.exception.ReservationNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final WebClient.Builder webClientBuilder;

    @Override
    public ReservationDTO save(ReservationDTO reservation){
        reservation.setUuid(UUID.randomUUID().toString());
        reservation.setDate(LocalDate.now());
        return modelToDto(reservationRepository.save(dtoToModel(reservation)));
    }

    @Override
    public void delete(String uuid) {
        Reservation reservation = reservationRepository.findByUuid(uuid)
                .orElseThrow(() -> new ReservationNotFoundException("Prenotazione con uuid " + uuid + " non trovata"));

        reservationRepository.deleteById(reservation.getId());
    }


    public List<ReservationDTO> findByUserUuid(String userUuid){
        return reservationRepository.findByUserUuid(userUuid)
                .stream()
                .map(this::modelToDto)
                .toList();
    }

    public List<ReservationDTO> findByEventUuid(String eventUuid){
        return reservationRepository.findByEventUuid(eventUuid)
                .stream()
                .map(this::modelToDto)
                .toList();
    }

    private ReservationDTO modelToDto(Reservation reservation) {
        EventDTO event = webClientBuilder.build()
                .get()
                .uri("http://event-service/api/v1/events/{uuid}", reservation.getEventUuid())
                .retrieve()
                .bodyToMono(EventDTO.class)
                .block();

        if (event == null) {
            throw new RuntimeException("Evento non trovato per uuid: " + reservation.getEventUuid());
        }

        return ReservationDTO.builder()
                .date(reservation.getDate())
                .eventTitle(event.getTitle())
                .eventDate(event.getDate())
                .eventLocation(event.getLocation())
                .build();
    }


    private Reservation dtoToModel(ReservationDTO reservation){
        return Reservation.builder()
                .uuid(reservation.getUuid())
                .userUuid(reservation.getUserUuid())
                .eventUuid(reservation.getEventUuid())
                .date(reservation.getDate())
                .build();
    }
}
