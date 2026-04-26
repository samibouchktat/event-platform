package com.eventplatform.dto.quote;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class QuoteRequestCreateRequest {

    @NotNull(message = "Pack ID is required")
    private Long packId;

    @NotBlank(message = "Customer name is required")
    @Size(max = 150, message = "Customer name must not exceed 150 characters")
    private String customerName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Customer email format is invalid")
    @Size(max = 150, message = "Customer email must not exceed 150 characters")
    private String customerEmail;

    @NotBlank(message = "Customer phone is required")
    @Size(max = 30, message = "Customer phone must not exceed 30 characters")
    private String customerPhone;

    @NotNull(message = "Event date is required")
    @FutureOrPresent(message = "Event date must be today or in the future")
    private LocalDate eventDate;

    @NotBlank(message = "Event city is required")
    @Size(max = 100, message = "Event city must not exceed 100 characters")
    private String eventCity;

    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "Guest count must be at least 1")
    private Integer guestCount;

    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    private String message;
}