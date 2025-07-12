package it.profice.project.reservation_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {

    private String uuid;
    private String userUuid;
    private String eventUuid;
    private LocalDate date;

}
