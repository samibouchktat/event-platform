package com.eventplatform.dto.pack;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProviderPackRequest {

    @NotBlank(message = "Pack name is required")
    @Size(max = 150, message = "Pack name must not exceed 150 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotBlank(message = "Event type is required")
    @Size(max = 80, message = "Event type must not exceed 80 characters")
    private String eventType;

    @NotBlank(message = "Service type is required")
    @Size(max = 80, message = "Service type must not exceed 80 characters")
    private String serviceType;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Minimum guests is required")
    @Min(value = 1, message = "Minimum guests must be at least 1")
    private Integer minGuests;

    @NotNull(message = "Maximum guests is required")
    @Min(value = 1, message = "Maximum guests must be at least 1")
    private Integer maxGuests;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 2000, message = "Service area must not exceed 2000 characters")
    private String serviceArea;

    @Size(max = 2000, message = "Included services must not exceed 2000 characters")
    private String includedServices;

    @Size(max = 2000, message = "Excluded services must not exceed 2000 characters")
    private String excludedServices;

    @NotNull(message = "Booking deadline days is required")
    @Min(value = 0, message = "Booking deadline days must be 0 or greater")
    private Integer bookingDeadlineDays;
    @Size(max = 1000, message = "Image URL must not exceed 1000 characters")
    private String imageUrl;
    private Boolean active;
}