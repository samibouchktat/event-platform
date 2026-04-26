package com.eventplatform.controller;

import com.eventplatform.dto.pack.ProviderPackRequest;
import com.eventplatform.dto.pack.ProviderPackResponse;
import com.eventplatform.service.ProviderPackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider/packs")
@RequiredArgsConstructor
public class ProviderPackController {

    private final ProviderPackService providerPackService;

    @PostMapping
    public ResponseEntity<ProviderPackResponse> createPack(
            @Valid @RequestBody ProviderPackRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        ProviderPackResponse response = providerPackService.createPack(email, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProviderPackResponse>> getMyPacks(
            Authentication authentication
    ) {
        String email = authentication.getName();

        List<ProviderPackResponse> response = providerPackService.getMyPacks(email);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{packId}")
    public ResponseEntity<ProviderPackResponse> getMyPackById(
            @PathVariable Long packId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        ProviderPackResponse response = providerPackService.getMyPackById(email, packId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{packId}")
    public ResponseEntity<ProviderPackResponse> updatePack(
            @PathVariable Long packId,
            @Valid @RequestBody ProviderPackRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        ProviderPackResponse response = providerPackService.updatePack(email, packId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{packId}")
    public ResponseEntity<Void> deletePack(
            @PathVariable Long packId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        providerPackService.deletePack(email, packId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{packId}/toggle-status")
    public ResponseEntity<ProviderPackResponse> togglePackStatus(
            @PathVariable Long packId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        ProviderPackResponse response = providerPackService.togglePackStatus(email, packId);

        return ResponseEntity.ok(response);
    }
}