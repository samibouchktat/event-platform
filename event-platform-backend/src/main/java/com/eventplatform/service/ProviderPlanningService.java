package com.eventplatform.service;

import com.eventplatform.dto.planning.ProviderPlanningBookingResponse;

import java.time.LocalDate;
import java.util.List;

public interface ProviderPlanningService {

    List<ProviderPlanningBookingResponse> getProviderPlanning(String providerEmail);

    List<ProviderPlanningBookingResponse> getProviderPlanningByDate(
            String providerEmail,
            LocalDate eventDate
    );
}