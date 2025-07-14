package it.profice.project.reservation_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String uuid;
    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String userUuid;
    @NotNull
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String eventUuid;
    @NotNull
    private LocalDate date;
    private String eventTitle;
    private Date eventDate;
    private String eventLocation;

}
