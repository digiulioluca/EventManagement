package it.profice.project.user_service.dto;

import it.profice.project.user_service.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private String uuid;
    private String name;
    private String password;
    private String email;
    private Role role;
    private List<ReservationDTO> reservations;
    private List<EventDTO> events;

}
