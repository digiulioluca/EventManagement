package it.profice.project.event_service.dto;

import it.profice.project.event_service.model.Category;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {

    // DTO per la gestione dei metodi GET, POST, PUT e PATCH

    private String uuid;
    @Size(min = 6, max = 50)
    @NotNull
    @NotEmpty
    private String title;
    @Size(max = 100)
    @NotNull
    @NotEmpty
    private String description;
    @NotNull
    private Date date;
    @NotNull
    @NotEmpty
    private String location;
    @Min(100)
    @NotNull
    private Integer totalSeats;
    @Min(0)
    @NotNull
    private Integer availableSeats;
    private boolean state;
    @NotNull
    private Category eventCategory;
    @NotNull
    @NotEmpty
    private String userUuid;
}
