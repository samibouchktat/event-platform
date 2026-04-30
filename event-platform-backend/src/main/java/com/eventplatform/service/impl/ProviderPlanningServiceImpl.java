package com.eventplatform.service.impl;

import com.eventplatform.dto.planning.ProviderPlanningBookingResponse;
import com.eventplatform.entity.Booking;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.RoleName;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.mapper.ProviderPlanningMapper;
import com.eventplatform.repository.BookingRepository;
import com.eventplatform.repository.ProviderProfileRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.ProviderPlanningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProviderPlanningServiceImpl implements ProviderPlanningService {

    private final BookingRepository bookingRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;
    private final ProviderPlanningMapper providerPlanningMapper;

    @Override
    public List<ProviderPlanningBookingResponse> getProviderPlanning(String providerEmail) {
        ProviderProfile providerProfile = getProviderProfileForCurrentProvider(providerEmail);

        return bookingRepository.findByProviderProfileOrderByEventDateAsc(providerProfile)
                .stream()
                .map(providerPlanningMapper::toResponse)
                .toList();
    }

    @Override
    public List<ProviderPlanningBookingResponse> getProviderPlanningByDate(
            String providerEmail,
            LocalDate eventDate
    ) {
        ProviderProfile providerProfile = getProviderProfileForCurrentProvider(providerEmail);

        return bookingRepository.findByProviderProfileAndEventDateOrderByCreatedAtDesc(
                        providerProfile,
                        eventDate
                )
                .stream()
                .map(providerPlanningMapper::toResponse)
                .toList();
    }

    private ProviderProfile getProviderProfileForCurrentProvider(String email) {
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
            throw new ApiException(HttpStatus.FORBIDDEN, "Only providers can access planning");
        }
    }
}