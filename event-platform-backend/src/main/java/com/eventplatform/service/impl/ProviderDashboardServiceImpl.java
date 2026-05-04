package com.eventplatform.service.impl;

import com.eventplatform.dto.dashboard.ProviderDashboardStatsResponse;
import com.eventplatform.entity.BookingStatus;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.QuoteRequestStatus;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.repository.BookingRepository;
import com.eventplatform.repository.ProviderPackRepository;
import com.eventplatform.repository.ProviderProfileRepository;
import com.eventplatform.repository.QuoteRequestRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.ProviderDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProviderDashboardServiceImpl implements ProviderDashboardService {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ProviderPackRepository providerPackRepository;
    private final QuoteRequestRepository quoteRequestRepository;
    private final BookingRepository bookingRepository;

    @Override
    public ProviderDashboardStatsResponse getProviderDashboardStats(String providerEmail) {
        User providerUser = userRepository.findByEmail(providerEmail)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Provider user not found"
                ));

        ProviderProfile providerProfile = providerProfileRepository.findByUser(providerUser)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Provider profile not found"
                ));

        Long providerProfileId = providerProfile.getId();

        long totalPacks = providerPackRepository.countByProviderProfileId(providerProfileId);
        long activePacks = providerPackRepository.countByProviderProfileIdAndActiveTrue(providerProfileId);
        long inactivePacks = providerPackRepository.countByProviderProfileIdAndActiveFalse(providerProfileId);

        long totalQuoteRequests = quoteRequestRepository.countByProviderProfileId(providerProfileId);
        long pendingQuoteRequests = quoteRequestRepository.countByProviderProfileIdAndStatus(
                providerProfileId,
                QuoteRequestStatus.PENDING
        );
        long inDiscussionQuoteRequests = quoteRequestRepository.countByProviderProfileIdAndStatus(
                providerProfileId,
                QuoteRequestStatus.IN_DISCUSSION
        );
        long acceptedQuoteRequests = quoteRequestRepository.countByProviderProfileIdAndStatus(
                providerProfileId,
                QuoteRequestStatus.ACCEPTED
        );
        long rejectedQuoteRequests = quoteRequestRepository.countByProviderProfileIdAndStatus(
                providerProfileId,
                QuoteRequestStatus.REJECTED
        );
        long cancelledQuoteRequests = quoteRequestRepository.countByProviderProfileIdAndStatus(
                providerProfileId,
                QuoteRequestStatus.CANCELLED
        );

        long totalBookings = bookingRepository.countByProviderProfileId(providerProfileId);
        long pendingDepositBookings = bookingRepository.countByProviderProfileIdAndStatus(
                providerProfileId,
                BookingStatus.PENDING_DEPOSIT
        );
        long confirmedBookings = bookingRepository.countByProviderProfileIdAndStatus(
                providerProfileId,
                BookingStatus.CONFIRMED
        );
        long completedBookings = bookingRepository.countByProviderProfileIdAndStatus(
                providerProfileId,
                BookingStatus.COMPLETED
        );
        long cancelledBookings = bookingRepository.countByProviderProfileIdAndStatus(
                providerProfileId,
                BookingStatus.CANCELLED
        );

        return ProviderDashboardStatsResponse.builder()
                .totalPacks(totalPacks)
                .activePacks(activePacks)
                .inactivePacks(inactivePacks)
                .totalQuoteRequests(totalQuoteRequests)
                .pendingQuoteRequests(pendingQuoteRequests)
                .inDiscussionQuoteRequests(inDiscussionQuoteRequests)
                .acceptedQuoteRequests(acceptedQuoteRequests)
                .rejectedQuoteRequests(rejectedQuoteRequests)
                .cancelledQuoteRequests(cancelledQuoteRequests)
                .totalBookings(totalBookings)
                .pendingDepositBookings(pendingDepositBookings)
                .confirmedBookings(confirmedBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .build();
    }
}