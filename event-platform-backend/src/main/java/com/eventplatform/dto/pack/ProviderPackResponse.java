package com.eventplatform.dto.pack;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ProviderPackResponse {

    private Long id;

    private Long providerProfileId;

    private String providerBusinessName;

    private String name;

    private String description;

    private String eventType;

    private String serviceType;

    private BigDecimal price;

    private Integer minGuests;

    private Integer maxGuests;

    private String city;

    private String serviceArea;

    private String includedServices;

    private String excludedServices;

    private Integer bookingDeadlineDays;

    private boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}