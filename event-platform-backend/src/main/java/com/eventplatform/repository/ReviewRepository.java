package com.eventplatform.repository;

import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByBookingId(Long bookingId);

    List<Review> findByProviderPackAndVisibleTrueOrderByCreatedAtDesc(
            ProviderPack providerPack
    );

    @Query("""
            select coalesce(avg(r.rating), 0)
            from Review r
            where r.providerPack.id = :packId
              and r.visible = true
            """)
    Double findAverageRatingByPackId(Long packId);

    @Query("""
            select count(r)
            from Review r
            where r.providerPack.id = :packId
              and r.visible = true
            """)
    Long countVisibleReviewsByPackId(Long packId);
}