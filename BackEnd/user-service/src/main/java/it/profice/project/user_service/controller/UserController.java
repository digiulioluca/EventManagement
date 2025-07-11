package it.profice.project.user_service.controller;

import it.profice.project.user_service.dto.UserDTO;
import it.profice.project.user_service.service.UserService;
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
    public UserDTO save(@RequestBody UserDTO user) {
        return userService.save(user);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public UserDTO update(@RequestBody UserDTO user) {
        return userService.update(user);
    }

    @PatchMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public UserDTO partialUpdate(@RequestBody UserDTO user) {
        return userService.partialUpdate(user);
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String uuid) {
        userService.delete(uuid);
    }
}