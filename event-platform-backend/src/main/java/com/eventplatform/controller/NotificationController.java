package com.eventplatform.controller;

import com.eventplatform.dto.notification.NotificationResponse;
import com.eventplatform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            Authentication authentication
    ) {
        String email = authentication.getName();

        List<NotificationResponse> response =
                notificationService.getMyNotifications(email);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> countMyUnreadNotifications(
            Authentication authentication
    ) {
        String email = authentication.getName();

        long unreadCount = notificationService.countMyUnreadNotifications(email);

        return ResponseEntity.ok(Map.of("unreadCount", unreadCount));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();

        NotificationResponse response = notificationService.markAsRead(email, id);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            Authentication authentication
    ) {
        String email = authentication.getName();

        notificationService.markAllAsRead(email);

        return ResponseEntity.noContent().build();
    }
}