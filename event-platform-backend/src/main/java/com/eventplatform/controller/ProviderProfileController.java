package com.eventplatform.controller;

import com.eventplatform.dto.provider.ProviderProfileRequest;
import com.eventplatform.dto.provider.ProviderProfileResponse;
import com.eventplatform.service.ProviderProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider/profile")
@RequiredArgsConstructor
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;

    @PostMapping
    public ResponseEntity<ProviderProfileResponse> createProfile(
            @Valid @RequestBody ProviderProfileRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        ProviderProfileResponse response = providerProfileService.createProfile(email, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ProviderProfileResponse> getMyProfile(
            Authentication authentication
    ) {
        String email = authentication.getName();

        ProviderProfileResponse response = providerProfileService.getMyProfile(email);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ProviderProfileResponse> updateMyProfile(
            @Valid @RequestBody ProviderProfileRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        ProviderProfileResponse response = providerProfileService.updateMyProfile(email, request);

        return ResponseEntity.ok(response);
    }
}