package com.eventplatform.service;

import com.eventplatform.dto.provider.ProviderProfileRequest;
import com.eventplatform.dto.provider.ProviderProfileResponse;

public interface ProviderProfileService {

    ProviderProfileResponse createProfile(String email, ProviderProfileRequest request);

    ProviderProfileResponse getMyProfile(String email);

    ProviderProfileResponse updateMyProfile(String email, ProviderProfileRequest request);
}