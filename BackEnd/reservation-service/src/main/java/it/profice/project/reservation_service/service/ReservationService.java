package it.profice.project.reservation_service.service;

import it.profice.project.reservation_service.dto.ReservationDTO;

import java.util.List;

public interface ReservationService {

    ReservationDTO save(ReservationDTO reservationDTO);
    void delete(String uuid);
    List<ReservationDTO> findByUserUuid(String userUuid);
    List<ReservationDTO> findByEventUuid(String eventUuid);
}
