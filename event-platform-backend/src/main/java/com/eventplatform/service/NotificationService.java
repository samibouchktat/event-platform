package com.eventplatform.service;

import com.eventplatform.dto.notification.NotificationResponse;
import com.eventplatform.entity.NotificationType;
import com.eventplatform.entity.User;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> getMyNotifications(String email);

    long countMyUnreadNotifications(String email);

    NotificationResponse markAsRead(String email, Long notificationId);

    void markAllAsRead(String email);

    void createNotification(
            User recipient,
            NotificationType type,
            String title,
            String message,
            String relatedResourceType,
            Long relatedResourceId
    );
}