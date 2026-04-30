package com.eventplatform.repository;

import com.eventplatform.entity.Booking;
import com.eventplatform.entity.BookingStatus;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.QuoteRequest;
import com.eventplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByQuoteRequest(QuoteRequest quoteRequest);

    Optional<Booking> findByQuoteRequest(QuoteRequest quoteRequest);

    List<Booking> findByProviderProfileOrderByEventDateAsc(ProviderProfile providerProfile);

    List<Booking> findByProviderProfileAndStatusOrderByEventDateAsc(
            ProviderProfile providerProfile,
            BookingStatus status
    );

    List<Booking> findByProviderProfileAndEventDateOrderByCreatedAtDesc(
            ProviderProfile providerProfile,
            LocalDate eventDate
    );

    Optional<Booking> findByIdAndProviderProfile(Long id, ProviderProfile providerProfile);

    List<Booking> findByClientOrderByEventDateDesc(User client);

    Optional<Booking> findByIdAndClient(Long id, User client);

    long countByStatus(BookingStatus status);
}