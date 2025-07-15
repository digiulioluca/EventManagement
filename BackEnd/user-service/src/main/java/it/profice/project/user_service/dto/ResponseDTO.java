package it.profice.project.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO {

    /* DTO di risposta per il login.
    L'uuid diventerà un parametro del LocalStorage*/

    private String uuid;
    private String response;
}
