package com.eventplatform.dto.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class BookingDocumentUploadRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 180, message = "Title must not exceed 180 characters")
    private String title;

    @NotBlank(message = "Document type is required")
    private String documentType;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private MultipartFile file;
}