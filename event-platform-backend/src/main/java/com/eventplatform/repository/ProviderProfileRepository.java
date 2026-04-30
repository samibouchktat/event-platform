package com.eventplatform.repository;

import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {

    Optional<ProviderProfile> findByUser(User user);

    boolean existsByUser(User user);

    boolean existsByIce(String ice);

    List<ProviderProfile> findAllByOrderByCreatedAtDesc();
}