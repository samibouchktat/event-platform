package com.eventplatform.repository;

import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.QuoteRequest;
import com.eventplatform.entity.QuoteRequestStatus;
import com.eventplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, Long> {

    List<QuoteRequest> findByClientOrderByCreatedAtDesc(User client);

    List<QuoteRequest> findByClientOrCustomerEmailIgnoreCaseOrderByCreatedAtDesc(
            User client,
            String customerEmail
    );

    List<QuoteRequest> findByProviderProfileOrderByCreatedAtDesc(
            ProviderProfile providerProfile
    );
    long countByStatus(QuoteRequestStatus status);

    Optional<QuoteRequest> findByIdAndClient(Long id, User client);

    Optional<QuoteRequest> findByIdAndProviderProfile(
            Long id,
            ProviderProfile providerProfile
    );

    long countByProviderProfileId(Long providerProfileId);

    long countByProviderProfileIdAndStatus(
            Long providerProfileId,
            QuoteRequestStatus status
    );
    Optional<QuoteRequest> findByIdAndClientOrIdAndCustomerEmailIgnoreCase(
            Long id1,
            User client,
            Long id2,
            String customerEmail
    );
}