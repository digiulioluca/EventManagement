package it.profice.project.reservation_service.service;

import it.profice.project.reservation_service.dto.ReservationDTO;
import it.profice.project.reservation_service.model.Reservation;
import it.profice.project.reservation_service.repository.ReservationRepository;
import it.profice.project.reservation_service.exception.ReservationNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    @Override
    public ReservationDTO save(ReservationDTO reservation){
       reservation.setUuid(UUID.randomUUID().toString());
        return modelToDto(reservationRepository.save(dtoToModel(reservation)));
    }

    @Override
    public void delete(String uuid){
        Reservation reservation = reservationRepository.findByUuid(uuid).orElseThrow(ReservationNotFoundException::new);
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
    private ReservationDTO modelToDto(Reservation reservation){
        return ReservationDTO.builder()
                .uuid(reservation.getUuid())
                .userUuid(reservation.getUserUuid())
                .eventUuid(reservation.getEventUuid())
                .date(reservation.getDate())
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
