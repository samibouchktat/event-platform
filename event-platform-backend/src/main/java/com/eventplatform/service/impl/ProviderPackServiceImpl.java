package com.eventplatform.service.impl;

import com.eventplatform.dto.pack.ProviderPackRequest;
import com.eventplatform.dto.pack.ProviderPackResponse;
import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.RoleName;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.mapper.ProviderPackMapper;
import com.eventplatform.repository.ProviderPackRepository;
import com.eventplatform.repository.ProviderProfileRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.ProviderPackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProviderPackServiceImpl implements ProviderPackService {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ProviderPackRepository providerPackRepository;
    private final ProviderPackMapper providerPackMapper;

    @Override
    public ProviderPackResponse createPack(String email, ProviderPackRequest request) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        validateGuestsRange(request);
        validatePackNameUniqueness(providerProfile, request.getName());

        ProviderPack pack = providerPackMapper.toEntity(request, providerProfile);
        ProviderPack savedPack = providerPackRepository.save(pack);

        return providerPackMapper.toResponse(savedPack);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderPackResponse> getMyPacks(String email) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        return providerPackRepository.findByProviderProfileOrderByCreatedAtDesc(providerProfile)
                .stream()
                .map(providerPackMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderPackResponse getMyPackById(String email, Long packId) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        ProviderPack pack = getPackByIdAndProviderProfile(packId, providerProfile);

        return providerPackMapper.toResponse(pack);
    }

    @Override
    public ProviderPackResponse updatePack(String email, Long packId, ProviderPackRequest request) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        validateGuestsRange(request);

        ProviderPack pack = getPackByIdAndProviderProfile(packId, providerProfile);

        validatePackNameUniquenessForUpdate(providerProfile, pack, request.getName());

        providerPackMapper.updateEntity(pack, request);

        ProviderPack updatedPack = providerPackRepository.save(pack);

        return providerPackMapper.toResponse(updatedPack);
    }

    @Override
    public void deletePack(String email, Long packId) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        ProviderPack pack = getPackByIdAndProviderProfile(packId, providerProfile);

        providerPackRepository.delete(pack);
    }

    @Override
    public ProviderPackResponse togglePackStatus(String email, Long packId) {
        ProviderProfile providerProfile = getProviderProfileForCurrentUser(email);

        ProviderPack pack = getPackByIdAndProviderProfile(packId, providerProfile);

        pack.setActive(!pack.isActive());

        ProviderPack updatedPack = providerPackRepository.save(pack);

        return providerPackMapper.toResponse(updatedPack);
    }

    private ProviderProfile getProviderProfileForCurrentUser(String email) {
        User user = getUserByEmail(email);

        ensureUserIsProvider(user);

        return providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Provider profile not found. Please complete onboarding first"
                ));
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
            throw new ApiException(HttpStatus.FORBIDDEN, "Only providers can manage packs");
        }
    }

    private ProviderPack getPackByIdAndProviderProfile(Long packId, ProviderProfile providerProfile) {
        return providerPackRepository.findByIdAndProviderProfile(packId, providerProfile)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pack not found"));
    }

    private void validateGuestsRange(ProviderPackRequest request) {
        if (request.getMinGuests() > request.getMaxGuests()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Minimum guests must be less than or equal to maximum guests"
            );
        }
    }

    private void validatePackNameUniqueness(ProviderProfile providerProfile, String packName) {
        String cleanedName = packName.trim();

        if (providerPackRepository.existsByNameAndProviderProfile(cleanedName, providerProfile)) {
            throw new ApiException(HttpStatus.CONFLICT, "Pack name already exists");
        }
    }

    private void validatePackNameUniquenessForUpdate(
            ProviderProfile providerProfile,
            ProviderPack currentPack,
            String newPackName
    ) {
        String cleanedName = newPackName.trim();

        boolean sameNameAsCurrentPack = currentPack.getName().equalsIgnoreCase(cleanedName);

        if (!sameNameAsCurrentPack
                && providerPackRepository.existsByNameAndProviderProfile(cleanedName, providerProfile)) {
            throw new ApiException(HttpStatus.CONFLICT, "Pack name already exists");
        }
    }
}