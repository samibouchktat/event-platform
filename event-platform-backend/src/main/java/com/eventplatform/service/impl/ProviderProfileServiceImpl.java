package com.eventplatform.service.impl;

import com.eventplatform.dto.provider.ProviderProfileRequest;
import com.eventplatform.dto.provider.ProviderProfileResponse;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.RoleName;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.mapper.ProviderProfileMapper;
import com.eventplatform.repository.ProviderProfileRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.ProviderProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProviderProfileServiceImpl implements ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;
    private final ProviderProfileMapper providerProfileMapper;

    @Override
    public ProviderProfileResponse createProfile(String email, ProviderProfileRequest request) {
        User user = getUserByEmail(email);

        ensureUserIsProvider(user);

        if (providerProfileRepository.existsByUser(user)) {
            throw new ApiException(HttpStatus.CONFLICT, "Provider profile already exists");
        }

        validateIceUniqueness(request.getIce());

        ProviderProfile profile = providerProfileMapper.toEntity(request, user);
        ProviderProfile savedProfile = providerProfileRepository.save(profile);

        return providerProfileMapper.toResponse(savedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderProfileResponse getMyProfile(String email) {
        User user = getUserByEmail(email);

        ensureUserIsProvider(user);

        ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Provider profile not found"));

        return providerProfileMapper.toResponse(profile);
    }

    @Override
    public ProviderProfileResponse updateMyProfile(String email, ProviderProfileRequest request) {
        User user = getUserByEmail(email);

        ensureUserIsProvider(user);

        ProviderProfile profile = providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Provider profile not found"));

        validateIceUniquenessForUpdate(request.getIce(), profile);

        providerProfileMapper.updateEntity(profile, request);

        ProviderProfile updatedProfile = providerProfileRepository.save(profile);

        return providerProfileMapper.toResponse(updatedProfile);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void ensureUserIsProvider(User user) {
        boolean isProvider = user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_PROVIDER);

        if (!isProvider) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only providers can manage provider profile");
        }
    }

    private void validateIceUniqueness(String ice) {
        if (ice == null || ice.trim().isEmpty()) {
            return;
        }

        if (providerProfileRepository.existsByIce(ice.trim())) {
            throw new ApiException(HttpStatus.CONFLICT, "ICE already exists");
        }
    }

    private void validateIceUniquenessForUpdate(String ice, ProviderProfile currentProfile) {
        if (ice == null || ice.trim().isEmpty()) {
            return;
        }

        String cleanedIce = ice.trim();

        boolean sameIceAsCurrentProfile =
                currentProfile.getIce() != null && currentProfile.getIce().equals(cleanedIce);

        if (!sameIceAsCurrentProfile && providerProfileRepository.existsByIce(cleanedIce)) {
            throw new ApiException(HttpStatus.CONFLICT, "ICE already exists");
        }
    }
}