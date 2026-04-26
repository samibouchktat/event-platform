package com.eventplatform.dto.booking;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BookingCreateFromQuoteRequest {

    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;

    @DecimalMin(value = "0.0", inclusive = false, message = "Deposit amount must be greater than 0")
    private BigDecimal depositAmount;

    @Size(max = 2000, message = "Provider notes must not exceed 2000 characters")
    private String providerNotes;
}