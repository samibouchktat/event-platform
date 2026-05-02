package com.eventplatform.service.impl;

import com.eventplatform.dto.review.ReviewCreateRequest;
import com.eventplatform.dto.review.ReviewResponse;
import com.eventplatform.entity.Booking;
import com.eventplatform.entity.BookingStatus;
import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.Review;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.mapper.ReviewMapper;
import com.eventplatform.repository.BookingRepository;
import com.eventplatform.repository.ProviderPackRepository;
import com.eventplatform.repository.ReviewRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ProviderPackRepository providerPackRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public ReviewResponse createReviewForBooking(
            String clientEmail,
            Long bookingId,
            ReviewCreateRequest request
    ) {
        User client = userRepository.findByEmail(clientEmail.trim().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (!booking.getClient().getId().equals(client.getId())) {
            throw new ApiException(
                    HttpStatus.FORBIDDEN,
                    "You can review only your own bookings"
            );
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Only completed bookings can be reviewed"
            );
        }

        if (reviewRepository.existsByBookingId(bookingId)) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "This booking has already been reviewed"
            );
        }

        ProviderPack providerPack = booking.getProviderPack();

        Review review = Review.builder()
                .rating(request.getRating())
                .comment(cleanNullable(request.getComment()))
                .booking(booking)
                .client(client)
                .providerPack(providerPack)
                .providerProfile(booking.getProviderProfile())
                .visible(true)
                .build();

        Review savedReview = reviewRepository.save(review);

        return reviewMapper.toResponse(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getPackReviews(Long packId) {
        ProviderPack providerPack = providerPackRepository.findById(packId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pack not found"));

        return reviewRepository
                .findByProviderPackAndVisibleTrueOrderByCreatedAtDesc(providerPack)
                .stream()
                .map(reviewMapper::toResponse)
                .toList();
    }

    private String cleanNullable(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}