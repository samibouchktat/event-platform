package com.eventplatform.dto.provider;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ProviderProfileResponse {

    private Long id;

    private Long userId;

    private String email;

    private String businessName;

    private String description;

    private String city;

    private String address;

    private String phone;

    private String website;

    private String ice;

    private String businessType;

    private String serviceArea;

    private boolean providerValidated;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}