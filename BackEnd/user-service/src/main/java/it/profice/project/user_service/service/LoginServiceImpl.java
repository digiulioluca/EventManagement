package it.profice.project.user_service.service;


import it.profice.project.user_service.controller.LoginController;
import it.profice.project.user_service.dto.RequestDTO;
import it.profice.project.user_service.dto.ResponseDTO;
import it.profice.project.user_service.dto.UserDTO;
import it.profice.project.user_service.exception.LoginUnauthorizedException;
import it.profice.project.user_service.exception.UserNotFoundException;
import it.profice.project.user_service.model.Role;
import it.profice.project.user_service.model.User;
import it.profice.project.user_service.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
@Slf4j
public class LoginServiceImpl implements LoginService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public ResponseDTO login(RequestDTO requestDTO) {
        User userToFind = userRepository.findByEmail(requestDTO.getEmail())
                .orElseThrow(UserNotFoundException::new);

        if(passwordEncoder.matches(requestDTO.getPassword(), userToFind.getPassword()))
            return modelToResponseDto(userToFind);

        throw new LoginUnauthorizedException();
    }

    @Override
    public UserDTO register(UserDTO newUser) {
        String encodedPassword = passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(encodedPassword);
        return modelToUserDTO(userRepository.save(userDtoToModel(newUser)));
    }

    private ResponseDTO modelToResponseDto(User user) {
        return ResponseDTO.builder()
                .uuid(user.getUuid())
                .response("Login effettuato!")
                .build();
    }

    private UserDTO modelToUserDTO(User user){
        return UserDTO.builder()
                .role(user.getRole())
                .email(user.getEmail())
                .uuid(user.getUuid())
                .name(user.getName())
                .build();
    }

    private User userDtoToModel(UserDTO newUser) {
        return User.builder()
                .email(newUser.getEmail())
                .password(newUser.getPassword())
                .role(Role.USER)
                .name(newUser.getName())
                .uuid(UUID.randomUUID().toString())
                .build();
    }
}
