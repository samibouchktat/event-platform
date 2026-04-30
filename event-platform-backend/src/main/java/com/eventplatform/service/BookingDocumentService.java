package com.eventplatform.service;

import com.eventplatform.dto.document.BookingDocumentCreateRequest;
import com.eventplatform.dto.document.BookingDocumentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BookingDocumentService {

    BookingDocumentResponse createProviderBookingDocument(
            String providerEmail,
            Long bookingId,
            BookingDocumentCreateRequest request
    );

    BookingDocumentResponse uploadProviderBookingDocument(
            String providerEmail,
            Long bookingId,
            String title,
            String documentType,
            String description,
            MultipartFile file
    );

    List<BookingDocumentResponse> getProviderBookingDocuments(
            String providerEmail,
            Long bookingId
    );

    void deleteProviderBookingDocument(
            String providerEmail,
            Long bookingId,
            Long documentId
    );

    List<BookingDocumentResponse> getClientBookingDocuments(
            String clientEmail,
            Long bookingId
    );
}