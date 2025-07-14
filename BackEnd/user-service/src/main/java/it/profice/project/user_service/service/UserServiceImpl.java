package it.profice.project.user_service.service;

import it.profice.project.event_service.dto.EventDTO;
import it.profice.project.reservation_service.dto.ReservationDTO;
import it.profice.project.user_service.dto.UserDTO;
import it.profice.project.user_service.model.Role;
import it.profice.project.user_service.model.User;
import it.profice.project.user_service.repository.UserRepository;
import it.profice.project.user_service.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final WebClient.Builder webClientBuilder;

    @Override
    public UserDTO findByUuid(String uuid) {
        User user = userRepository.findByUuid(uuid)
                .orElseThrow(UserNotFoundException::new);

        UserDTO ret = modelToDto(user);

        if (user.getRole() == Role.USER) {
            List<ReservationDTO> reservations = webClientBuilder.build()
                    .get()
                    .uri("http://reservation-service/api/v1/reservations/{uuid}/user",
                            uriBuilder -> uriBuilder.build(uuid))
                    .retrieve()
                    .bodyToFlux(ReservationDTO.class)
                    .collectList()
                    .block();
            ret.setReservations(reservations);
        } else {
            List<EventDTO> events = webClientBuilder.build()
                    .get()
                    .uri("http://event-service/api/v1/events/{uuid}/events",
                            uriBuilder -> uriBuilder.build(uuid))
                    .retrieve()
                    .bodyToFlux(EventDTO.class)
                    .collectList()
                            .block();
            ret.setEvents(events);
        }

        return ret;
    }

    @Override
    public UserDTO update(String uuid, UserDTO user) {
        User userToUpdate = userRepository.findByUuid(uuid)
                .orElseThrow(UserNotFoundException::new);

        userToUpdate.setName(user.getName());
        userToUpdate.setPassword(user.getPassword());
        userToUpdate.setEmail(user.getEmail());
        userToUpdate.setRole(user.getRole());

        return modelToDto(userRepository.save(userToUpdate));
    }

    @Override
    public UserDTO partialUpdate(String uuid, UserDTO user) {
        User userToUpdate = userRepository.findByUuid(uuid)
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
