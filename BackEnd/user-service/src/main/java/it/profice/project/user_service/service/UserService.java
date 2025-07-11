package it.profice.project.user_service.service;

import it.profice.project.user_service.dto.UserDTO;

public interface UserService {
    UserDTO findByUuid(String uuid);
    UserDTO save(UserDTO newUser);
    UserDTO update(UserDTO user);
    UserDTO partialUpdate(UserDTO user);
    void delete(String uuid);
}

