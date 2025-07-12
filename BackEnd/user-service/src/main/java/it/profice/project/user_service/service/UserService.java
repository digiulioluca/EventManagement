package it.profice.project.user_service.service;

import it.profice.project.user_service.dto.UserDTO;

public interface UserService {
    UserDTO findByUuid(String uuid);
    UserDTO save(UserDTO newUser);
    UserDTO update(String uuid, UserDTO user);
    UserDTO partialUpdate(String uuid, UserDTO user);
    void delete(String uuid);
}

