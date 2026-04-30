package com.eventplatform.mapper;

import com.eventplatform.dto.notification.NotificationResponse;
import com.eventplatform.entity.Notification;
import com.eventplatform.entity.User;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {
        User recipient = notification.getRecipient();

        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientId(recipient.getId())
                .recipientEmail(recipient.getEmail())
                .type(notification.getType().name())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .relatedResourceType(notification.getRelatedResourceType())
                .relatedResourceId(notification.getRelatedResourceId())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}