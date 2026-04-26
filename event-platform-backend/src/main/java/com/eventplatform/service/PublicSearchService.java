package com.eventplatform.service;

import com.eventplatform.dto.search.PackSearchResponse;

import java.math.BigDecimal;
import java.util.List;

public interface PublicSearchService {

    List<PackSearchResponse> searchPacks(
            String city,
            String eventType,
            String serviceType,
            Integer guests,
            BigDecimal maxBudget
    );
}