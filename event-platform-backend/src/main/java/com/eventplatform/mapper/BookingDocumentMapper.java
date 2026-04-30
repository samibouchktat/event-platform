package com.eventplatform.mapper;

import com.eventplatform.dto.document.BookingDocumentResponse;
import com.eventplatform.entity.BookingDocument;
import com.eventplatform.entity.User;
import org.springframework.stereotype.Component;

@Component
public class BookingDocumentMapper {

    public BookingDocumentResponse toResponse(BookingDocument document) {
        User uploadedBy = document.getUploadedBy();

        return BookingDocumentResponse.builder()
                .id(document.getId())
                .bookingId(document.getBooking().getId())
                .uploadedById(uploadedBy.getId())
                .uploadedByEmail(uploadedBy.getEmail())
                .uploadedByFullName(buildFullName(uploadedBy))
                .documentType(document.getDocumentType().name())
                .title(document.getTitle())
                .fileUrl(document.getFileUrl())
                .description(document.getDescription())
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .build();
    }

    private String buildFullName(User user) {
        String firstName = user.getFirstName() != null ? user.getFirstName().trim() : "";
        String lastName = user.getLastName() != null ? user.getLastName().trim() : "";

        String fullName = (firstName + " " + lastName).trim();

        if (fullName.isEmpty()) {
            return user.getEmail();
        }

        return fullName;
    }
}