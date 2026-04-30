package com.eventplatform.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class AdminProviderResponse {

    private Long providerProfileId;

    private Long userId;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private boolean enabled;

    private boolean providerValidated;

    private String businessName;

    private String businessType;

    private String city;

    private String address;

    private String ice;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}