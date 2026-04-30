package com.eventplatform.service;

import com.eventplatform.dto.admin.AdminDashboardStatsResponse;
import com.eventplatform.dto.admin.AdminProviderResponse;
import com.eventplatform.dto.admin.AdminReportOverviewResponse;
import com.eventplatform.dto.admin.AdminUserResponse;

import java.util.List;

public interface AdminService {

    AdminDashboardStatsResponse getDashboardStats(String adminEmail);

    List<AdminProviderResponse> getAllProviders(String adminEmail);

    AdminProviderResponse getProviderById(String adminEmail, Long providerProfileId);

    AdminProviderResponse validateProvider(String adminEmail, Long providerProfileId);

    AdminProviderResponse rejectProvider(String adminEmail, Long providerProfileId);

    List<AdminUserResponse> getAllUsers(String adminEmail);

    AdminUserResponse getUserById(String adminEmail, Long userId);

    AdminUserResponse enableUser(String adminEmail, Long userId);

    AdminUserResponse disableUser(String adminEmail, Long userId);

    AdminReportOverviewResponse getReportOverview(String adminEmail);
}