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

    /**
     * Injection di UserRepository e WebClient.Builder
     */
    private final UserRepository userRepository;
    private final WebClient.Builder webClientBuilder;

    /**
     * La ricerca del singolo utente si suddivide in tre fasi:
     * - ricerca tramite il metodo findByUuid e istanza oggetto User
     * - istanza di un oggetto UserDTO
     * - modifica dell'attributo reservations per l'utente o
     * events per l'admin tramite l'utilizzo del webClientBuilder
     *
     * @param uuid dell'utente da ricercare
     *
     * @return UserDTO
     */
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

    /**
     * Aggiornamento totale utente. Due fasi:
     * - ricerca utente via uuid e istanza oggetto User
     * - vengono richiamati tutti i setter dell'istanza user per
     * assumere i campi ricevuti dal controller
     *
     * @param uuid dell'utente
     * @param user json con tutti i campi
     *
     * @return UserDTO aggiornato
     */
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

    /**
     * Aggiornamento parziale dell'utente. Differentemente dal metodo update,
     * il partialUpdate opera attraverso un controllo prima dell'invocazione
     * del metodo setter. Se il campo controllato è null, viene conservato
     * il valore originale, ricavato dall'istanza di User
     *
     * @param uuid dell'utente
     * @param user json con tutti i campi
     *
     * @return UserDTO aggiornato
     */
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

    /**
     * Cancellazione dell'utente.
     *
     * @param uuid dell'utente da eliminare
     */
    @Override
    public void delete(String uuid) {
        User userToDelete = userRepository.findByUuid(uuid)
                .orElseThrow(UserNotFoundException::new);
        userRepository.deleteById(userToDelete.getId());
    }

    /**
     * Conversione da User a UserDTO
     *
     * @param user object
     * @return UserDTO -> uuid, name, email, password e role
     */
    private UserDTO modelToDto(User user) {
        return UserDTO.builder()
                .uuid(user.getUuid())
                .name(user.getName())
                .password(user.getPassword())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    /**
     * Conversione da UserDTO a User
     *
     * @param dto UserDTO object
     * @return User -> uuid, name, email, password e role
     */
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
