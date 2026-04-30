package com.eventplatform.controller;

import com.eventplatform.dto.admin.AdminDashboardStatsResponse;
import com.eventplatform.dto.admin.AdminProviderResponse;
import com.eventplatform.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.eventplatform.dto.admin.AdminUserResponse;
import com.eventplatform.dto.admin.AdminReportOverviewResponse;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats(
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        AdminDashboardStatsResponse response = adminService.getDashboardStats(adminEmail);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/providers")
    public ResponseEntity<List<AdminProviderResponse>> getAllProviders(
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        List<AdminProviderResponse> response = adminService.getAllProviders(adminEmail);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/providers/{providerProfileId}")
    public ResponseEntity<AdminProviderResponse> getProviderById(
            @PathVariable Long providerProfileId,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        AdminProviderResponse response = adminService.getProviderById(
                adminEmail,
                providerProfileId
        );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/providers/{providerProfileId}/validate")
    public ResponseEntity<AdminProviderResponse> validateProvider(
            @PathVariable Long providerProfileId,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        AdminProviderResponse response = adminService.validateProvider(
                adminEmail,
                providerProfileId
        );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/providers/{providerProfileId}/reject")
    public ResponseEntity<AdminProviderResponse> rejectProvider(
            @PathVariable Long providerProfileId,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        AdminProviderResponse response = adminService.rejectProvider(
                adminEmail,
                providerProfileId
        );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers(
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        List<AdminUserResponse> response = adminService.getAllUsers(adminEmail);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<AdminUserResponse> getUserById(
            @PathVariable Long userId,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        AdminUserResponse response = adminService.getUserById(adminEmail, userId);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/users/{userId}/enable")
    public ResponseEntity<AdminUserResponse> enableUser(
            @PathVariable Long userId,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        AdminUserResponse response = adminService.enableUser(adminEmail, userId);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/users/{userId}/disable")
    public ResponseEntity<AdminUserResponse> disableUser(
            @PathVariable Long userId,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        AdminUserResponse response = adminService.disableUser(adminEmail, userId);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/reports/overview")
    public ResponseEntity<AdminReportOverviewResponse> getReportOverview(
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();

        AdminReportOverviewResponse response = adminService.getReportOverview(adminEmail);

        return ResponseEntity.ok(response);
    }
}