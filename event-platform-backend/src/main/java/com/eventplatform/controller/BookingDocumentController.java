package com.eventplatform.controller;

import com.eventplatform.dto.document.BookingDocumentCreateRequest;
import com.eventplatform.dto.document.BookingDocumentResponse;
import com.eventplatform.service.BookingDocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingDocumentController {

    private final BookingDocumentService bookingDocumentService;

    @PostMapping("/api/provider/bookings/{bookingId}/documents")
    public ResponseEntity<BookingDocumentResponse> createProviderBookingDocument(
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingDocumentCreateRequest request,
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        BookingDocumentResponse response =
                bookingDocumentService.createProviderBookingDocument(
                        providerEmail,
                        bookingId,
                        request
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/provider/bookings/{bookingId}/documents")
    public ResponseEntity<List<BookingDocumentResponse>> getProviderBookingDocuments(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        List<BookingDocumentResponse> response =
                bookingDocumentService.getProviderBookingDocuments(
                        providerEmail,
                        bookingId
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/provider/bookings/{bookingId}/documents/{documentId}")
    public ResponseEntity<Void> deleteProviderBookingDocument(
            @PathVariable Long bookingId,
            @PathVariable Long documentId,
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        bookingDocumentService.deleteProviderBookingDocument(
                providerEmail,
                bookingId,
                documentId
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/client/bookings/{bookingId}/documents")
    public ResponseEntity<List<BookingDocumentResponse>> getClientBookingDocuments(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        String clientEmail = authentication.getName();

        List<BookingDocumentResponse> response =
                bookingDocumentService.getClientBookingDocuments(
                        clientEmail,
                        bookingId
                );

        return ResponseEntity.ok(response);
    }
    @PostMapping(value = "/api/provider/bookings/{bookingId}/documents/upload", consumes = "multipart/form-data")
    public ResponseEntity<BookingDocumentResponse> uploadProviderBookingDocument(
            @PathVariable Long bookingId,
            @RequestParam("title") String title,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        BookingDocumentResponse response =
                bookingDocumentService.uploadProviderBookingDocument(
                        providerEmail,
                        bookingId,
                        title,
                        documentType,
                        description,
                        file
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
}