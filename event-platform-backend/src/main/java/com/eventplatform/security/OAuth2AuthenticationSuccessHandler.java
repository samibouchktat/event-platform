package com.eventplatform.security;

import com.eventplatform.entity.Role;
import com.eventplatform.entity.RoleName;
import com.eventplatform.entity.User;
import com.eventplatform.repository.RoleRepository;
import com.eventplatform.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");

        if (email == null || email.isBlank()) {
            response.sendRedirect(frontendUrl + "/login?error=google_email_missing");
            return;
        }

        String normalizedEmail = email.trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseGet(() -> createGoogleClientUser(
                        normalizedEmail,
                        firstName,
                        lastName
                ));

        if (!user.isEnabled()) {
            response.sendRedirect(frontendUrl + "/login?error=account_disabled");
            return;
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        String token = jwtService.generateToken(userDetails);
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);

        response.sendRedirect(frontendUrl + "/oauth2/success?token=" + encodedToken);
    }

    private User createGoogleClientUser(
            String email,
            String firstName,
            String lastName
    ) {
        Role clientRole = roleRepository.findByName(RoleName.ROLE_CLIENT)
                .orElseThrow(() -> new IllegalStateException("CLIENT role not found"));

        User user = User.builder()
                .email(email)
                .firstName(firstName != null && !firstName.isBlank() ? firstName : "Client")
                .lastName(lastName != null && !lastName.isBlank() ? lastName : "Google")
                .phone(null)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .enabled(true)
                .providerValidated(false)
                .roles(Set.of(clientRole))
                .build();

        return userRepository.save(user);
    }
}