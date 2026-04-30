package com.eventplatform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Utilisateur qui reçoit la notification.
     * Peut être CLIENT, PROVIDER ou ADMIN plus tard.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 60)
    private NotificationType type;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    /**
     * Exemple :
     * relatedResourceType = "QUOTE_REQUEST"
     * relatedResourceId = 1
     *
     * ou :
     * relatedResourceType = "BOOKING"
     * relatedResourceId = 3
     */
    @Column(name = "related_resource_type", length = 80)
    private String relatedResourceType;

    @Column(name = "related_resource_id")
    private Long relatedResourceId;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean read = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();

        if (this.type == null) {
            this.type = NotificationType.GENERAL;
        }
    }
}