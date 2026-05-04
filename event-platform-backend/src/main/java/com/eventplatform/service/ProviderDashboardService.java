package com.eventplatform.service;

import com.eventplatform.dto.dashboard.ProviderDashboardStatsResponse;

public interface ProviderDashboardService {

    ProviderDashboardStatsResponse getProviderDashboardStats(String providerEmail);
}