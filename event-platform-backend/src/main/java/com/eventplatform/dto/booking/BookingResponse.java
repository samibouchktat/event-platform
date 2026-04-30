package com.eventplatform.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class BookingResponse {

    private Long id;

    private Long quoteRequestId;

    private Long clientId;

    private Long providerProfileId;

    private String providerBusinessName;

    private Long packId;

    private String packName;

    private String packEventType;

    private String packServiceType;

    private String customerName;

    private String customerEmail;

    private String customerPhone;

    private LocalDate eventDate;

    private String eventCity;

    private Integer guestCount;

    private BigDecimal totalAmount;

    private BigDecimal depositAmount;

    private String status;

    private String providerNotes;

    private String clientNotes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private boolean depositPaid;

    private LocalDateTime depositPaidAt;
}