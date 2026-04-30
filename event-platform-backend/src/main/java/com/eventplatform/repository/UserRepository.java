package com.eventplatform.repository;

import com.eventplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.eventplatform.entity.RoleName;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    @Query("""
        SELECT COUNT(DISTINCT u)
        FROM User u
        JOIN u.roles r
        WHERE r.name = :roleName
        """)
    long countUsersByRole(@Param("roleName") RoleName roleName);

    @Query("""
        SELECT COUNT(DISTINCT u)
        FROM User u
        JOIN u.roles r
        WHERE r.name = com.eventplatform.entity.RoleName.ROLE_PROVIDER
          AND u.providerValidated = :providerValidated
        """)
    long countProvidersByValidationStatus(@Param("providerValidated") boolean providerValidated);
}