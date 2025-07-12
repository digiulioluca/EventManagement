package it.profice.project.auth_service.service;

import it.profice.project.auth_service.dto.*;
import it.profice.project.auth_service.repository.UserSecurityRepository;
import it.profice.project.user_service.model.Role;
import it.profice.project.user_service.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import it.profice.project.auth_service.security.UserDetailsImpl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserSecurityRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .uuid(UUID.randomUUID().toString())
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .build();
        userRepository.save(user);
        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        return AuthResponse.builder()
                .token(jwtService.generateToken((UserDetails) userDetails))  // cast esplicito
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        return AuthResponse.builder()
                .token(jwtService.generateToken((UserDetails) userDetails))  // cast esplicito
                .build();
    }

}