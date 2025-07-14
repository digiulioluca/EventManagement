package it.profice.project.reservation_service.dto;

import jakarta.validation.constraints.NotNull;
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
    @NotNull
    private String userUuid;
    @NotNull
    private String eventUuid;
    @NotNull
    private LocalDate date;
    private String eventTitle;

}
