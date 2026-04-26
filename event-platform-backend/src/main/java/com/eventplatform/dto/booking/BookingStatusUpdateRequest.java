package com.eventplatform.dto.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(
            regexp = "PENDING_DEPOSIT|CONFIRMED|CANCELLED|COMPLETED",
            message = "Status must be PENDING_DEPOSIT, CONFIRMED, CANCELLED or COMPLETED"
    )
    private String status;

    @Size(max = 2000, message = "Provider notes must not exceed 2000 characters")
    private String providerNotes;
}