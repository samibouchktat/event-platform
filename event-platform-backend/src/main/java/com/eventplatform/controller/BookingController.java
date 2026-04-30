package com.eventplatform.controller;

import com.eventplatform.dto.booking.BookingCreateFromQuoteRequest;
import com.eventplatform.dto.booking.BookingResponse;
import com.eventplatform.dto.booking.BookingStatusUpdateRequest;
import com.eventplatform.exception.ApiException;
import com.eventplatform.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/api/provider/bookings/from-quote/{quoteRequestId}")
    public ResponseEntity<BookingResponse> createBookingFromQuoteRequest(
            @PathVariable Long quoteRequestId,
            @Valid @RequestBody BookingCreateFromQuoteRequest request,
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        BookingResponse response = bookingService.createBookingFromQuoteRequest(
                providerEmail,
                quoteRequestId,
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/provider/bookings")
    public ResponseEntity<List<BookingResponse>> getProviderBookings(
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        List<BookingResponse> response = bookingService.getProviderBookings(providerEmail);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/provider/bookings/{bookingId}")
    public ResponseEntity<BookingResponse> getProviderBookingById(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        BookingResponse response = bookingService.getProviderBookingById(
                providerEmail,
                bookingId
        );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/api/provider/bookings/{bookingId}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingStatusUpdateRequest request,
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        BookingResponse response = bookingService.updateBookingStatus(
                providerEmail,
                bookingId,
                request
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/client/bookings")
    public ResponseEntity<List<BookingResponse>> getClientBookings(
            Authentication authentication
    ) {
        String clientEmail = authentication.getName();

        List<BookingResponse> response = bookingService.getClientBookings(clientEmail);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/client/bookings/{bookingId}")
    public ResponseEntity<BookingResponse> getClientBookingById(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        String clientEmail = authentication.getName();

        BookingResponse response = bookingService.getClientBookingById(
                clientEmail,
                bookingId
        );

        return ResponseEntity.ok(response);
    }
    @PatchMapping("/api/provider/bookings/{bookingId}/deposit/mark-paid")
    public ResponseEntity<BookingResponse> markDepositAsPaid(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        if (authentication == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Authentication is required");
        }

        String providerEmail = authentication.getName();

        System.out.println("CONTROLLER - markDepositAsPaid called");
        System.out.println("providerEmail = " + providerEmail);
        System.out.println("bookingId = " + bookingId);

        BookingResponse response = bookingService.markDepositAsPaid(
                providerEmail,
                bookingId
        );

        return ResponseEntity.ok(response);
    }
}