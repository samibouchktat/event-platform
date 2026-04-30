package com.eventplatform.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class BookingDocumentResponse {

    private Long id;

    private Long bookingId;

    private Long uploadedById;

    private String uploadedByEmail;

    private String uploadedByFullName;

    private String documentType;

    private String title;

    private String fileUrl;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}