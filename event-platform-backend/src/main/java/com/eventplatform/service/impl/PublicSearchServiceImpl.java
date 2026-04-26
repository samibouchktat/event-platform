package com.eventplatform.service.impl;

import com.eventplatform.dto.search.PackSearchResponse;
import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.repository.ProviderPackRepository;
import com.eventplatform.service.PublicSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicSearchServiceImpl implements PublicSearchService {

    private final ProviderPackRepository providerPackRepository;

    @Override
    public List<PackSearchResponse> searchPacks(
            String city,
            String eventType,
            String serviceType,
            Integer guests,
            BigDecimal maxBudget
    ) {
        String cityPattern = buildCityPattern(city);
        String cleanedEventType = cleanUpperNullable(eventType);
        String cleanedServiceType = cleanUpperNullable(serviceType);

        return providerPackRepository.searchActivePacks(
                        cityPattern,
                        cleanedEventType,
                        cleanedServiceType,
                        guests,
                        maxBudget
                )
                .stream()
                .map(this::toSearchResponse)
                .toList();
    }

    private PackSearchResponse toSearchResponse(ProviderPack pack) {
        ProviderProfile providerProfile = pack.getProviderProfile();

        return PackSearchResponse.builder()
                .packId(pack.getId())
                .packName(pack.getName())
                .description(pack.getDescription())
                .eventType(pack.getEventType())
                .serviceType(pack.getServiceType())
                .price(pack.getPrice())
                .minGuests(pack.getMinGuests())
                .maxGuests(pack.getMaxGuests())
                .city(pack.getCity())
                .serviceArea(pack.getServiceArea())
                .includedServices(pack.getIncludedServices())
                .bookingDeadlineDays(pack.getBookingDeadlineDays())
                .active(pack.isActive())
                .providerProfileId(providerProfile.getId())
                .providerBusinessName(providerProfile.getBusinessName())
                .providerCity(providerProfile.getCity())
                .providerValidated(providerProfile.getUser().isProviderValidated())
                .build();
    }

    private String cleanNullable(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }

    private String cleanUpperNullable(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim().toUpperCase();
    }
    private String buildCityPattern(String city) {
        if (city == null || city.trim().isEmpty()) {
            return null;
        }

        return "%" + city.trim().toLowerCase() + "%";
    }
}