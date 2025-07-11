package it.profice.project.user_service.controller;

import it.profice.project.user_service.dto.UserDTO;
import it.profice.project.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
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
    public UserDTO save(@RequestBody UserDTO user) {
        return userService.save(user);
    }

    @PutMapping
    public UserDTO update(@RequestBody UserDTO user) {
        return userService.update(user);
    }

    @PatchMapping
    public UserDTO partialUpdate(@RequestBody UserDTO user) {
        return userService.partialUpdate(user);
    }

    @DeleteMapping("/{uuid}")
    public void delete(@PathVariable String uuid) {
        userService.delete(uuid);
    }
}