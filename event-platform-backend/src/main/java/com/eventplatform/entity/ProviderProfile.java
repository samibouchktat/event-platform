package com.eventplatform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "provider_profiles",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_provider_profiles_user_id", columnNames = "user_id"),
                @UniqueConstraint(name = "uk_provider_profiles_ice", columnNames = "ice")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Chaque profil prestataire appartient à un seul utilisateur.
     * Un utilisateur prestataire ne peut avoir qu'un seul profil.
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "business_name", nullable = false, length = 150)
    private String businessName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(length = 255)
    private String address;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(length = 255)
    private String website;

    @Column(length = 50)
    private String ice;

    @Column(name = "business_type", nullable = false, length = 80)
    private String businessType;

    @Column(name = "service_area", columnDefinition = "TEXT")
    private String serviceArea;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}