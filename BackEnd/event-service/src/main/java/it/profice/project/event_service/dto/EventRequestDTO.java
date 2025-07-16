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
public class EventRequestDTO {

    // DTO per la ricerca eventi
    private String title;
    private Date dateFrom;
    private Date dateTo;
    private String location;
    private Category category;
}
