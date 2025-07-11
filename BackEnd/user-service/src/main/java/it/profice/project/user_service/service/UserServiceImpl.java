package it.profice.project.user_service.service;

import it.profice.project.user_service.dto.UserDTO;
import it.profice.project.user_service.model.User;
import it.profice.project.user_service.repository.UserRepository;
import it.profice.project.user_service.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    @Override
    public UserDTO findByUuid(String uuid) {
        return modelToDto(
                userRepository.findByUuid(uuid)
                        .orElseThrow(UserNotFoundException::new)
        );
    }

    @Override
    public UserDTO save(UserDTO newUser) {
        newUser.setUuid(UUID.randomUUID().toString());
        return modelToDto(userRepository.save(dtoToModel(newUser)));
    }

    @Override
    public UserDTO update(UserDTO user) {
        User userToUpdate = userRepository.findByUuid(user.getUuid())
                .orElseThrow(UserNotFoundException::new);

        user.setName(user.getName());
        user.setPassword(user.getPassword());
        user.setEmail(user.getEmail());
        user.setRole(user.getRole());

        return modelToDto(userRepository.save(userToUpdate));
    }

    @Override
    public UserDTO partialUpdate(UserDTO user) {
        User userToUpdate = userRepository.findByUuid(user.getUuid())
                .orElseThrow(UserNotFoundException::new);

        if (user.getName() != null) userToUpdate.setName(user.getName());
        if (user.getPassword() != null) userToUpdate.setPassword(user.getPassword());
        if (user.getEmail() != null) userToUpdate.setEmail(user.getEmail());
        if (user.getRole() != null) userToUpdate.setRole(user.getRole());

        return modelToDto(userRepository.save(userToUpdate));
    }

    @Override
    public void delete(String uuid) {
        User userToDelete = userRepository.findByUuid(uuid)
                .orElseThrow(UserNotFoundException::new);
        userRepository.deleteById(userToDelete.getId());
    }

    private UserDTO modelToDto(User user) {
        return UserDTO.builder()
                .uuid(user.getUuid())
                .name(user.getName())
                .password(user.getPassword())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    private User dtoToModel(UserDTO dto) {
        return User.builder()
                .uuid(dto.getUuid())
                .name(dto.getName())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .role(dto.getRole())
                .build();
    }
}
