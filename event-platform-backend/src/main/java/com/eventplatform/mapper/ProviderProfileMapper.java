package com.eventplatform.mapper;

import com.eventplatform.dto.provider.ProviderProfileRequest;
import com.eventplatform.dto.provider.ProviderProfileResponse;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ProviderProfileMapper {

    public ProviderProfile toEntity(ProviderProfileRequest request, User user) {
        return ProviderProfile.builder()
                .user(user)
                .businessName(clean(request.getBusinessName()))
                .description(cleanNullable(request.getDescription()))
                .city(clean(request.getCity()))
                .address(cleanNullable(request.getAddress()))
                .phone(clean(request.getPhone()))
                .website(cleanNullable(request.getWebsite()))
                .ice(cleanNullable(request.getIce()))
                .businessType(clean(request.getBusinessType()).toUpperCase())
                .serviceArea(cleanNullable(request.getServiceArea()))
                .build();
    }

    public void updateEntity(ProviderProfile profile, ProviderProfileRequest request) {
        profile.setBusinessName(clean(request.getBusinessName()));
        profile.setDescription(cleanNullable(request.getDescription()));
        profile.setCity(clean(request.getCity()));
        profile.setAddress(cleanNullable(request.getAddress()));
        profile.setPhone(clean(request.getPhone()));
        profile.setWebsite(cleanNullable(request.getWebsite()));
        profile.setIce(cleanNullable(request.getIce()));
        profile.setBusinessType(clean(request.getBusinessType()).toUpperCase());
        profile.setServiceArea(cleanNullable(request.getServiceArea()));
    }

    public ProviderProfileResponse toResponse(ProviderProfile profile) {
        User user = profile.getUser();

        return ProviderProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .email(user.getEmail())
                .businessName(profile.getBusinessName())
                .description(profile.getDescription())
                .city(profile.getCity())
                .address(profile.getAddress())
                .phone(profile.getPhone())
                .website(profile.getWebsite())
                .ice(profile.getIce())
                .businessType(profile.getBusinessType())
                .serviceArea(profile.getServiceArea())
                .providerValidated(user.isProviderValidated())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }

    private String clean(String value) {
        return value.trim();
    }

    private String cleanNullable(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}