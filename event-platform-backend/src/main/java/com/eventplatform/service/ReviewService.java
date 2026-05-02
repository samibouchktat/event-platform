package com.eventplatform.service;

import com.eventplatform.dto.review.ReviewCreateRequest;
import com.eventplatform.dto.review.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReviewForBooking(
            String clientEmail,
            Long bookingId,
            ReviewCreateRequest request
    );

    List<ReviewResponse> getPackReviews(Long packId);
}