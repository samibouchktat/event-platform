package com.eventplatform.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class AdminDashboardStatsResponse {

    private long totalUsers;

    private long totalClients;

    private long totalProviders;

    private long validatedProviders;

    private long pendingProviders;

    private long totalPacks;

    private long activePacks;

    private long totalQuoteRequests;

    private long totalBookings;
}