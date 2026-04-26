package com.eventplatform.service;

import com.eventplatform.dto.booking.BookingCreateFromQuoteRequest;
import com.eventplatform.dto.booking.BookingResponse;
import com.eventplatform.dto.booking.BookingStatusUpdateRequest;

import java.util.List;

public interface BookingService {

    BookingResponse createBookingFromQuoteRequest(
            String providerEmail,
            Long quoteRequestId,
            BookingCreateFromQuoteRequest request
    );

    List<BookingResponse> getProviderBookings(String providerEmail);

    BookingResponse getProviderBookingById(String providerEmail, Long bookingId);

    BookingResponse updateBookingStatus(
            String providerEmail,
            Long bookingId,
            BookingStatusUpdateRequest request
    );
    List<BookingResponse> getClientBookings(String clientEmail);

    BookingResponse getClientBookingById(String clientEmail, Long bookingId);
}