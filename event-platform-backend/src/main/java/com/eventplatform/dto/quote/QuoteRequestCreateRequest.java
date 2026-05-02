package com.eventplatform.dto.quote;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class QuoteRequestCreateRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid email format")
    private String customerEmail;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @NotNull(message = "Event date is required")
    private LocalDate eventDate;

    @NotBlank(message = "Event city is required")
    private String eventCity;

    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "Guest count must be greater than 0")
    private Integer guestCount;

    @DecimalMin(value = "0.0", inclusive = true, message = "Estimated budget must be positive")
    private BigDecimal estimatedBudget;

    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    private String message;
}