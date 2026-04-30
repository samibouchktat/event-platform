package com.eventplatform.controller;

import com.eventplatform.dto.planning.ProviderPlanningBookingResponse;
import com.eventplatform.service.ProviderPlanningService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/provider/planning")
@RequiredArgsConstructor
public class ProviderPlanningController {

    private final ProviderPlanningService providerPlanningService;

    @GetMapping("/bookings")
    public ResponseEntity<List<ProviderPlanningBookingResponse>> getProviderPlanning(
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        List<ProviderPlanningBookingResponse> response =
                providerPlanningService.getProviderPlanning(providerEmail);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/bookings/date/{eventDate}")
    public ResponseEntity<List<ProviderPlanningBookingResponse>> getProviderPlanningByDate(
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate eventDate,
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        List<ProviderPlanningBookingResponse> response =
                providerPlanningService.getProviderPlanningByDate(providerEmail, eventDate);

        return ResponseEntity.ok(response);
    }
}