package com.eventplatform.controller;

import com.eventplatform.dto.auth.AuthResponse;
import com.eventplatform.dto.auth.LoginRequest;
import com.eventplatform.dto.auth.RegisterRequest;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        Set<String> roles = user.getRoles()
                .stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        AuthResponse response = AuthResponse.builder()
                .token(null)
                .tokenType("Bearer")
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .enabled(user.isEnabled())
                .providerValidated(user.isProviderValidated())
                .roles(roles)
                .build();

        return ResponseEntity.ok(response);
    }
}