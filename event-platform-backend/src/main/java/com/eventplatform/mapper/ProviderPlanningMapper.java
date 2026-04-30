package com.eventplatform.mapper;

import com.eventplatform.dto.planning.ProviderPlanningBookingResponse;
import com.eventplatform.entity.Booking;
import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.QuoteRequest;
import org.springframework.stereotype.Component;

@Component
public class ProviderPlanningMapper {

    public ProviderPlanningBookingResponse toResponse(Booking booking) {
        QuoteRequest quoteRequest = booking.getQuoteRequest();
        ProviderProfile providerProfile = booking.getProviderProfile();
        ProviderPack providerPack = booking.getProviderPack();

        return ProviderPlanningBookingResponse.builder()
                .bookingId(booking.getId())
                .quoteRequestId(quoteRequest.getId())
                .providerProfileId(providerProfile.getId())
                .providerBusinessName(providerProfile.getBusinessName())
                .packId(providerPack.getId())
                .packName(providerPack.getName())
                .packEventType(providerPack.getEventType())
                .packServiceType(providerPack.getServiceType())
                .customerName(quoteRequest.getCustomerName())
                .customerEmail(quoteRequest.getCustomerEmail())
                .customerPhone(quoteRequest.getCustomerPhone())
                .eventDate(booking.getEventDate())
                .eventCity(booking.getEventCity())
                .guestCount(booking.getGuestCount())
                .totalAmount(booking.getTotalAmount())
                .depositAmount(booking.getDepositAmount())
                .status(booking.getStatus().name())
                .providerNotes(booking.getProviderNotes())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}