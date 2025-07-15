package it.profice.project.user_service.dto;

import it.profice.project.event_service.dto.EventDTO;
import it.profice.project.reservation_service.dto.ReservationDTO;
import it.profice.project.user_service.model.Role;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    // DTO "base" per la gestione dei metodi GET, POST, PUT e PATCH

    private String uuid;
    @NotBlank
    private String name;
    @NotBlank
    @Size(min = 6)
    private String password;
    @Email
    @NotEmpty
    private String email;
    private Role role;
    private List<ReservationDTO> reservations;
    private List<EventDTO> events;

}
