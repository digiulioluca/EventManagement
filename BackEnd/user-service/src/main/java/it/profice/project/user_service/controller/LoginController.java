package it.profice.project.user_service.controller;

import it.profice.project.user_service.dto.RequestDTO;
import it.profice.project.user_service.dto.ResponseDTO;
import it.profice.project.user_service.dto.UserDTO;
import it.profice.project.user_service.service.LoginService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/v1/auth")
@AllArgsConstructor
public class LoginController {

    private LoginService loginService;

    @GetMapping("/login")
    public ResponseDTO login(@RequestBody @Valid RequestDTO request) {
        return loginService.login(request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO register(@RequestBody @Valid UserDTO newUser) {
        return loginService.register(newUser);
    }
}
