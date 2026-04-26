package com.eventplatform.mapper;

import com.eventplatform.dto.booking.BookingResponse;
import com.eventplatform.entity.Booking;
import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.QuoteRequest;
import com.eventplatform.entity.User;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {
        QuoteRequest quoteRequest = booking.getQuoteRequest();
        User client = booking.getClient();
        ProviderProfile providerProfile = booking.getProviderProfile();
        ProviderPack providerPack = booking.getProviderPack();

        return BookingResponse.builder()
                .id(booking.getId())
                .quoteRequestId(quoteRequest.getId())
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
                .eventDate(booking.getEventDate())
                .eventCity(booking.getEventCity())
                .guestCount(booking.getGuestCount())
                .totalAmount(booking.getTotalAmount())
                .depositAmount(booking.getDepositAmount())
                .status(booking.getStatus().name())
                .providerNotes(booking.getProviderNotes())
                .clientNotes(booking.getClientNotes())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}