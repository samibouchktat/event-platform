package com.eventplatform.dto.quote;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class QuoteRequestResponse {

    private Long id;

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

    private String message;

    private String status;

    private String providerResponse;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}