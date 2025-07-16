package it.profice.project.user_service.service;


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

    /**
     * Injection della UserRepository e del PasswordEncoder
     * AllArgsConstructor genera automaticamente il costruttore con tutti
     * i parametri necessari per la dependency injection
     * */
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    /**
     * Il metodo gestisce la fase di login in due fasi:
     * - ricerca della mail sulla base dati
     * - confronto, attraverso il metodo matches, della pw inserita nel form
     * con la versione "grezza" della password sulla base dati
     *
     * @param requestDTO -> JSON
     *
     * @return responseDTO
     */
    @Override
    public ResponseDTO login(RequestDTO requestDTO) {
        User userToFind = userRepository.findByEmail(requestDTO.getEmail())
                .orElseThrow(UserNotFoundException::new);

        if(passwordEncoder.matches(requestDTO.getPassword(), userToFind.getPassword()))
            return modelToResponseDto(userToFind);

        throw new LoginUnauthorizedException();
    }

    /**
     * Registrazione. Dopo aver ricevuto il JSON dal client, la pw viene
     * criptata e, tramite il metodo modelToUserDTO, viene generato l'uuid
     *
     * @param  newUser -> JSON
     * @return userDTO
     */
    @Override
    public UserDTO register(UserDTO newUser) {
        String encodedPassword = passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(encodedPassword);
        return modelToUserDTO(userRepository.save(userDtoToModel(newUser)));
    }

    /**
     * Conversione da User a ResponseDTO
     *
     * @param user -> istanza dell'entità
     * @return ResponseDTO -> uuid e messaggio di conferma
     */
    private ResponseDTO modelToResponseDto(User user) {
        return ResponseDTO.builder()
                .uuid(user.getUuid())
                .response("Login effettuato!")
                .build();
    }

    /**
     * Conversione da User a UserDTO
     *
     * @param user -> istanza dell'entità
     * @return UserDTO -> ruolo, email, uuid, name
     */
    private UserDTO modelToUserDTO(User user){
        return UserDTO.builder()
                .role(user.getRole())
                .email(user.getEmail())
                .uuid(user.getUuid())
                .name(user.getName())
                .build();
    }

    /**
     * Conversione da UserDTO a User per il passaggio definitivo
     * alla base dati
     *
     * @param newUser -> JSON ricevuto dal client
     * @return User object
     */
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
