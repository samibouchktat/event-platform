package com.eventplatform.repository;

import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.QuoteRequest;
import com.eventplatform.entity.QuoteRequestStatus;
import com.eventplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, Long> {
    long countByProviderProfileId(Long providerProfileId);

    long countByProviderProfileIdAndStatus(Long providerProfileId, QuoteRequestStatus status);

    List<QuoteRequest> findByProviderProfileOrderByCreatedAtDesc(ProviderProfile providerProfile);

    List<QuoteRequest> findByProviderProfileAndStatusOrderByCreatedAtDesc(
            ProviderProfile providerProfile,
            QuoteRequestStatus status
    );

    Optional<QuoteRequest> findByIdAndProviderProfile(
            Long id,
            ProviderProfile providerProfile
    );

    List<QuoteRequest> findByClientOrderByCreatedAtDesc(User client);

    Optional<QuoteRequest> findByIdAndClient(
            Long id,
            User client
    );

    long countByStatus(QuoteRequestStatus status);
}