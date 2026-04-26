package com.eventplatform.mapper;

import com.eventplatform.dto.quote.QuoteRequestResponse;
import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.QuoteRequest;
import com.eventplatform.entity.User;
import org.springframework.stereotype.Component;

@Component
public class QuoteRequestMapper {

    public QuoteRequestResponse toResponse(QuoteRequest quoteRequest) {
        User client = quoteRequest.getClient();
        ProviderProfile providerProfile = quoteRequest.getProviderProfile();
        ProviderPack providerPack = quoteRequest.getProviderPack();

        return QuoteRequestResponse.builder()
                .id(quoteRequest.getId())
                .clientId(client != null ? client.getId() : null)
                .providerProfileId(providerProfile.getId())
                .providerBusinessName(providerProfile.getBusinessName())
                .packId(providerPack.getId())
                .packName(providerPack.getName())
                .packEventType(providerPack.getEventType())
                .packServiceType(providerPack.getServiceType())
                .customerName(quoteRequest.getCustomerName())
                .customerEmail(quoteRequest.getCustomerEmail())
                .customerPhone(quoteRequest.getCustomerPhone())
                .eventDate(quoteRequest.getEventDate())
                .eventCity(quoteRequest.getEventCity())
                .guestCount(quoteRequest.getGuestCount())
                .message(quoteRequest.getMessage())
                .status(quoteRequest.getStatus().name())
                .providerResponse(quoteRequest.getProviderResponse())
                .createdAt(quoteRequest.getCreatedAt())
                .updatedAt(quoteRequest.getUpdatedAt())
                .build();
    }
}