package com.eventplatform.dto.review;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long id;

    private Integer rating;
    private String comment;

    private Long bookingId;

    private Long clientId;
    private String clientFullName;

    private Long providerPackId;
    private String packName;

    private Long providerProfileId;
    private String providerBusinessName;

    private Boolean visible;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}