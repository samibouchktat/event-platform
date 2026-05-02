package com.eventplatform.controller;

import com.eventplatform.dto.review.ReviewCreateRequest;
import com.eventplatform.dto.review.ReviewResponse;
import com.eventplatform.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/api/client/bookings/{bookingId}/review")
    public ResponseEntity<ReviewResponse> createReviewForBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody ReviewCreateRequest request,
            Authentication authentication
    ) {
        String clientEmail = authentication.getName();

        ReviewResponse response = reviewService.createReviewForBooking(
                clientEmail,
                bookingId,
                request
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/public/packs/{packId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getPackReviews(
            @PathVariable Long packId
    ) {
        List<ReviewResponse> response = reviewService.getPackReviews(packId);

        return ResponseEntity.ok(response);
    }
}