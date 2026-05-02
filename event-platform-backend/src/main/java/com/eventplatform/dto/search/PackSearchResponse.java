package com.eventplatform.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class PackSearchResponse {

    private Long packId;

    private String packName;

    private String description;

    private String eventType;

    private String serviceType;

    private BigDecimal price;

    private Integer minGuests;

    private Integer maxGuests;

    private String city;

    private String serviceArea;

    private String includedServices;

    private Integer bookingDeadlineDays;

    private boolean active;

    private Long providerProfileId;

    private String providerBusinessName;

    private String providerCity;

    private boolean providerValidated;
    private String imageUrl;
    private Double averageRating;
    private Long reviewCount;
}