package com.eventplatform.dto.quote;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuoteRequestStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(
            regexp = "PENDING|IN_DISCUSSION|ACCEPTED|REJECTED|CANCELLED",
            message = "Status must be PENDING, IN_DISCUSSION, ACCEPTED, REJECTED or CANCELLED"
    )
    private String status;

    @Size(max = 2000, message = "Provider response must not exceed 2000 characters")
    private String providerResponse;
}