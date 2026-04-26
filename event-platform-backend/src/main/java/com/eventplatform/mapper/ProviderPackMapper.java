package com.eventplatform.mapper;

import com.eventplatform.dto.pack.ProviderPackRequest;
import com.eventplatform.dto.pack.ProviderPackResponse;
import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.ProviderProfile;
import org.springframework.stereotype.Component;

@Component
public class ProviderPackMapper {

    public ProviderPack toEntity(ProviderPackRequest request, ProviderProfile providerProfile) {
        return ProviderPack.builder()
                .providerProfile(providerProfile)
                .name(clean(request.getName()))
                .description(cleanNullable(request.getDescription()))
                .eventType(clean(request.getEventType()).toUpperCase())
                .serviceType(clean(request.getServiceType()).toUpperCase())
                .price(request.getPrice())
                .minGuests(request.getMinGuests())
                .maxGuests(request.getMaxGuests())
                .city(clean(request.getCity()))
                .serviceArea(cleanNullable(request.getServiceArea()))
                .includedServices(cleanNullable(request.getIncludedServices()))
                .excludedServices(cleanNullable(request.getExcludedServices()))
                .bookingDeadlineDays(request.getBookingDeadlineDays())
                .active(request.getActive() == null || request.getActive())
                .build();
    }

    public void updateEntity(ProviderPack pack, ProviderPackRequest request) {
        pack.setName(clean(request.getName()));
        pack.setDescription(cleanNullable(request.getDescription()));
        pack.setEventType(clean(request.getEventType()).toUpperCase());
        pack.setServiceType(clean(request.getServiceType()).toUpperCase());
        pack.setPrice(request.getPrice());
        pack.setMinGuests(request.getMinGuests());
        pack.setMaxGuests(request.getMaxGuests());
        pack.setCity(clean(request.getCity()));
        pack.setServiceArea(cleanNullable(request.getServiceArea()));
        pack.setIncludedServices(cleanNullable(request.getIncludedServices()));
        pack.setExcludedServices(cleanNullable(request.getExcludedServices()));
        pack.setBookingDeadlineDays(request.getBookingDeadlineDays());

        if (request.getActive() != null) {
            pack.setActive(request.getActive());
        }
    }

    public ProviderPackResponse toResponse(ProviderPack pack) {
        ProviderProfile providerProfile = pack.getProviderProfile();

        return ProviderPackResponse.builder()
                .id(pack.getId())
                .providerProfileId(providerProfile.getId())
                .providerBusinessName(providerProfile.getBusinessName())
                .name(pack.getName())
                .description(pack.getDescription())
                .eventType(pack.getEventType())
                .serviceType(pack.getServiceType())
                .price(pack.getPrice())
                .minGuests(pack.getMinGuests())
                .maxGuests(pack.getMaxGuests())
                .city(pack.getCity())
                .serviceArea(pack.getServiceArea())
                .includedServices(pack.getIncludedServices())
                .excludedServices(pack.getExcludedServices())
                .bookingDeadlineDays(pack.getBookingDeadlineDays())
                .active(pack.isActive())
                .createdAt(pack.getCreatedAt())
                .updatedAt(pack.getUpdatedAt())
                .build();
    }

    private String clean(String value) {
        return value.trim();
    }

    private String cleanNullable(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}