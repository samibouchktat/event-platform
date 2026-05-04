package com.eventplatform.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderDashboardStatsResponse {

    private long totalPacks;
    private long activePacks;
    private long inactivePacks;

    private long totalQuoteRequests;
    private long pendingQuoteRequests;
    private long inDiscussionQuoteRequests;
    private long acceptedQuoteRequests;
    private long rejectedQuoteRequests;
    private long cancelledQuoteRequests;

    private long totalBookings;
    private long pendingDepositBookings;
    private long confirmedBookings;
    private long completedBookings;
    private long cancelledBookings;
}