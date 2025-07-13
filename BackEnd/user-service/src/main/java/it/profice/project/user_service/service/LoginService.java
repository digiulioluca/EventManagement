package it.profice.project.user_service.service;

import it.profice.project.user_service.dto.RequestDTO;
import it.profice.project.user_service.dto.ResponseDTO;
import it.profice.project.user_service.dto.UserDTO;

public interface LoginService {
    ResponseDTO login(RequestDTO requestDTO);
    UserDTO register(UserDTO newUser);
}
