package com.eventplatform.repository;

import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.ProviderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProviderPackRepository extends JpaRepository<ProviderPack, Long> {

    long countByProviderProfileId(Long providerProfileId);

    long countByProviderProfileIdAndActiveTrue(Long providerProfileId);

    long countByProviderProfileIdAndActiveFalse(Long providerProfileId);
    
    List<ProviderPack> findByProviderProfileOrderByCreatedAtDesc(
            ProviderProfile providerProfile
    );

    Optional<ProviderPack> findByIdAndProviderProfile(
            Long id,
            ProviderProfile providerProfile
    );

    boolean existsByNameAndProviderProfile(
            String name,
            ProviderProfile providerProfile
    );

    boolean existsByIdAndProviderProfile(
            Long id,
            ProviderProfile providerProfile
    );

    List<ProviderPack> findByProviderProfileAndActiveTrueOrderByCreatedAtDesc(
            ProviderProfile providerProfile
    );
    long countByActiveFalse();
    long countByActiveTrue();

    @Query("""
            SELECT p
            FROM ProviderPack p
            JOIN FETCH p.providerProfile pp
            JOIN FETCH pp.user u
            WHERE p.active = true
              AND u.providerValidated = true
              AND u.enabled = true
              AND (:cityPattern IS NULL OR LOWER(p.city) LIKE :cityPattern)
              AND (:eventType IS NULL OR p.eventType = :eventType)
              AND (:serviceType IS NULL OR p.serviceType = :serviceType)
              AND (:guests IS NULL OR (:guests BETWEEN p.minGuests AND p.maxGuests))
              AND (:maxBudget IS NULL OR p.price <= :maxBudget)
            ORDER BY p.createdAt DESC
            """)
    List<ProviderPack> searchActivePacks(
            @Param("cityPattern") String cityPattern,
            @Param("eventType") String eventType,
            @Param("serviceType") String serviceType,
            @Param("guests") Integer guests,
            @Param("maxBudget") BigDecimal maxBudget
    );

}