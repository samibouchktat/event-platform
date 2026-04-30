package com.eventplatform.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class AdminReportOverviewResponse {

    private Map<String, Long> usersByRole;

    private Map<String, Long> providersByValidation;

    private Map<String, Long> packsByStatus;

    private Map<String, Long> quoteRequestsByStatus;

    private Map<String, Long> bookingsByStatus;
}