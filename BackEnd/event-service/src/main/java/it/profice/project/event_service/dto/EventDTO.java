package it.profice.project.event_service.dto;

import it.profice.project.event_service.model.Category;
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
    private String uuid;
    private String title;
    private String description;
    private Date date;
    private String location;
    private Integer totalSeats;
    private Integer availableSeats;
    private boolean state;
    private Category eventCategory;
}
