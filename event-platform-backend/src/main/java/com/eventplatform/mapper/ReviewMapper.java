package com.eventplatform.mapper;

import com.eventplatform.dto.review.ReviewResponse;
import com.eventplatform.entity.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .bookingId(review.getBooking().getId())
                .clientId(review.getClient().getId())
                .clientFullName(
                        review.getClient().getFirstName() + " " + review.getClient().getLastName()
                )
                .providerPackId(review.getProviderPack().getId())
                .packName(review.getProviderPack().getName())
                .providerProfileId(review.getProviderProfile().getId())
                .providerBusinessName(review.getProviderProfile().getBusinessName())
                .visible(review.getVisible())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}