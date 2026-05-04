package com.eventplatform.controller;

import com.eventplatform.dto.dashboard.ProviderDashboardStatsResponse;
import com.eventplatform.service.ProviderDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProviderDashboardController {

    private final ProviderDashboardService providerDashboardService;

    @GetMapping("/api/provider/dashboard/stats")
    public ResponseEntity<ProviderDashboardStatsResponse> getProviderDashboardStats(
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        ProviderDashboardStatsResponse response =
                providerDashboardService.getProviderDashboardStats(providerEmail);

        return ResponseEntity.ok(response);
    }
}