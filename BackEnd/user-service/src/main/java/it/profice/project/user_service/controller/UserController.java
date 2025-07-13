package it.profice.project.user_service.controller;

import it.profice.project.user_service.dto.UserDTO;
import it.profice.project.user_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/{uuid}")
    public UserDTO getByUuid(@PathVariable String uuid) {
        return userService.findByUuid(uuid);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO save(@RequestBody @Valid UserDTO user) {
        return userService.save(user);
    }

    @PutMapping("/{uuid}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public UserDTO update(@PathVariable String uuid, @RequestBody @Valid UserDTO user) {
        return userService.update(uuid, user);
    }

    @PatchMapping("/{uuid}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public UserDTO partialUpdate(@PathVariable String uuid, @RequestBody @Valid UserDTO user) {
        return userService.partialUpdate(uuid, user);
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String uuid) {
        userService.delete(uuid);
    }

    @GetMapping("/email/{email}")
    public UserDTO getByEmail(@PathVariable String email) {
        return userService.findByEmail(email);
    }

}