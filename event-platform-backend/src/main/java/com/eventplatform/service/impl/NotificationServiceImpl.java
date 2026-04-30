package com.eventplatform.service.impl;

import com.eventplatform.dto.notification.NotificationResponse;
import com.eventplatform.entity.Notification;
import com.eventplatform.entity.NotificationType;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.mapper.NotificationMapper;
import com.eventplatform.repository.NotificationRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(String email) {
        User user = getUserByEmail(email);

        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long countMyUnreadNotifications(String email) {
        User user = getUserByEmail(email);

        return notificationRepository.countByRecipientAndReadFalse(user);
    }

    @Override
    public NotificationResponse markAsRead(String email, Long notificationId) {
        User user = getUserByEmail(email);

        Notification notification = notificationRepository.findByIdAndRecipient(notificationId, user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Notification not found"));

        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        }

        Notification updatedNotification = notificationRepository.save(notification);

        return notificationMapper.toResponse(updatedNotification);
    }

    @Override
    public void markAllAsRead(String email) {
        User user = getUserByEmail(email);

        List<Notification> unreadNotifications =
                notificationRepository.findByRecipientAndReadFalseOrderByCreatedAtDesc(user);

        LocalDateTime now = LocalDateTime.now();

        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(now);
        });

        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    public void createNotification(
            User recipient,
            NotificationType type,
            String title,
            String message,
            String relatedResourceType,
            Long relatedResourceId
    ) {
        if (recipient == null) {
            return;
        }

        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .title(clean(title))
                .message(clean(message))
                .relatedResourceType(cleanNullable(relatedResourceType))
                .relatedResourceId(relatedResourceId)
                .read(false)
                .build();

        notificationRepository.save(notification);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private String clean(String value) {
        return value.trim();
    }

    private String cleanNullable(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}