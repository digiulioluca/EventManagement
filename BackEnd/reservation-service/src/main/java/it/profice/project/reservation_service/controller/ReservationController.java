package it.profice.project.reservation_service.controller;

import it.profice.project.reservation_service.dto.ReservationDTO;
import it.profice.project.reservation_service.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reservation")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationDTO save(@RequestBody ReservationDTO reservation){
        return reservationService.save(reservation);
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String uuid){
        reservationService.delete(uuid);
    }

    @GetMapping("/{userUuid}/user")
    public List<ReservationDTO> findByUser(@PathVariable String userUuid){
        return reservationService.findByUserUuid(userUuid);
    }

    @GetMapping("/{eventUuid}/event")
    public List<ReservationDTO> findByEvent(@PathVariable String eventUuid){
        return reservationService.findByEventUuid(eventUuid);
    }
}
