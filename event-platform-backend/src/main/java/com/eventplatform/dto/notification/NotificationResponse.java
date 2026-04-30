package com.eventplatform.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class NotificationResponse {

    private Long id;

    private Long recipientId;

    private String recipientEmail;

    private String type;

    private String title;

    private String message;

    private String relatedResourceType;

    private Long relatedResourceId;

    private boolean read;

    private LocalDateTime createdAt;

    private LocalDateTime readAt;
}