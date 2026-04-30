package com.eventplatform.service.impl;

import com.eventplatform.dto.admin.AdminDashboardStatsResponse;
import com.eventplatform.dto.admin.AdminProviderResponse;
import com.eventplatform.dto.admin.AdminUserResponse;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.RoleName;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.repository.BookingRepository;
import com.eventplatform.repository.ProviderPackRepository;
import com.eventplatform.repository.ProviderProfileRepository;
import com.eventplatform.repository.QuoteRequestRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.eventplatform.dto.admin.AdminReportOverviewResponse;
import com.eventplatform.entity.BookingStatus;
import com.eventplatform.entity.QuoteRequestStatus;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProviderPackRepository providerPackRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final QuoteRequestRepository quoteRequestRepository;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getDashboardStats(String adminEmail) {
        User admin = getUserByEmail(adminEmail);

        ensureUserIsAdmin(admin);

        long totalUsers = userRepository.count();
        long totalClients = userRepository.countUsersByRole(RoleName.ROLE_CLIENT);
        long totalProviders = userRepository.countUsersByRole(RoleName.ROLE_PROVIDER);

        long validatedProviders = userRepository.countProvidersByValidationStatus(true);
        long pendingProviders = userRepository.countProvidersByValidationStatus(false);

        long totalPacks = providerPackRepository.count();
        long activePacks = providerPackRepository.countByActiveTrue();

        long totalQuoteRequests = quoteRequestRepository.count();
        long totalBookings = bookingRepository.count();

        return AdminDashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalClients(totalClients)
                .totalProviders(totalProviders)
                .validatedProviders(validatedProviders)
                .pendingProviders(pendingProviders)
                .totalPacks(totalPacks)
                .activePacks(activePacks)
                .totalQuoteRequests(totalQuoteRequests)
                .totalBookings(totalBookings)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminReportOverviewResponse getReportOverview(String adminEmail) {
        User admin = getUserByEmail(adminEmail);

        ensureUserIsAdmin(admin);

        return AdminReportOverviewResponse.builder()
                .usersByRole(buildUsersByRoleReport())
                .providersByValidation(buildProvidersByValidationReport())
                .packsByStatus(buildPacksByStatusReport())
                .quoteRequestsByStatus(buildQuoteRequestsByStatusReport())
                .bookingsByStatus(buildBookingsByStatusReport())
                .build();
    }
    private Map<String, Long> buildUsersByRoleReport() {
        Map<String, Long> report = new LinkedHashMap<>();

        report.put("CLIENT", userRepository.countUsersByRole(RoleName.ROLE_CLIENT));
        report.put("PROVIDER", userRepository.countUsersByRole(RoleName.ROLE_PROVIDER));
        report.put("ADMIN", userRepository.countUsersByRole(RoleName.ROLE_ADMIN));

        return report;
    }

    private Map<String, Long> buildProvidersByValidationReport() {
        Map<String, Long> report = new LinkedHashMap<>();

        report.put("VALIDATED", userRepository.countProvidersByValidationStatus(true));
        report.put("PENDING_OR_REJECTED", userRepository.countProvidersByValidationStatus(false));

        return report;
    }

    private Map<String, Long> buildPacksByStatusReport() {
        Map<String, Long> report = new LinkedHashMap<>();

        report.put("ACTIVE", providerPackRepository.countByActiveTrue());
        report.put("INACTIVE", providerPackRepository.countByActiveFalse());

        return report;
    }

    private Map<String, Long> buildQuoteRequestsByStatusReport() {
        Map<String, Long> report = new LinkedHashMap<>();

        for (QuoteRequestStatus status : QuoteRequestStatus.values()) {
            report.put(status.name(), quoteRequestRepository.countByStatus(status));
        }

        return report;
    }

    private Map<String, Long> buildBookingsByStatusReport() {
        Map<String, Long> report = new LinkedHashMap<>();

        for (BookingStatus status : BookingStatus.values()) {
            report.put(status.name(), bookingRepository.countByStatus(status));
        }

        return report;
    }
    @Override
    @Transactional(readOnly = true)
    public List<AdminProviderResponse> getAllProviders(String adminEmail) {
        User admin = getUserByEmail(adminEmail);

        ensureUserIsAdmin(admin);

        return providerProfileRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toAdminProviderResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminProviderResponse getProviderById(String adminEmail, Long providerProfileId) {
        User admin = getUserByEmail(adminEmail);

        ensureUserIsAdmin(admin);

        ProviderProfile providerProfile = getProviderProfileById(providerProfileId);

        return toAdminProviderResponse(providerProfile);
    }

    @Override
    public AdminProviderResponse validateProvider(String adminEmail, Long providerProfileId) {
        User admin = getUserByEmail(adminEmail);

        ensureUserIsAdmin(admin);

        ProviderProfile providerProfile = getProviderProfileById(providerProfileId);

        User providerUser = providerProfile.getUser();
        providerUser.setProviderValidated(true);

        userRepository.save(providerUser);

        return toAdminProviderResponse(providerProfile);
    }

    @Override
    public AdminProviderResponse rejectProvider(String adminEmail, Long providerProfileId) {
        User admin = getUserByEmail(adminEmail);

        ensureUserIsAdmin(admin);

        ProviderProfile providerProfile = getProviderProfileById(providerProfileId);

        User providerUser = providerProfile.getUser();
        providerUser.setProviderValidated(false);

        userRepository.save(providerUser);

        return toAdminProviderResponse(providerProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers(String adminEmail) {
        User admin = getUserByEmail(adminEmail);

        ensureUserIsAdmin(admin);

        return userRepository.findAll()
                .stream()
                .map(this::toAdminUserResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserResponse getUserById(String adminEmail, Long userId) {
        User admin = getUserByEmail(adminEmail);

        ensureUserIsAdmin(admin);

        User user = getUserByIdOrThrow(userId);

        return toAdminUserResponse(user);
    }

    @Override
    public AdminUserResponse enableUser(String adminEmail, Long userId) {
        User admin = getUserByEmail(adminEmail);

        ensureUserIsAdmin(admin);

        User user = getUserByIdOrThrow(userId);

        user.setEnabled(true);

        User updatedUser = userRepository.save(user);

        return toAdminUserResponse(updatedUser);
    }

    @Override
    public AdminUserResponse disableUser(String adminEmail, Long userId) {
        User admin = getUserByEmail(adminEmail);

        ensureUserIsAdmin(admin);

        User user = getUserByIdOrThrow(userId);

        if (hasRole(user, RoleName.ROLE_ADMIN)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Admin accounts cannot be disabled");
        }

        user.setEnabled(false);

        User updatedUser = userRepository.save(user);

        return toAdminUserResponse(updatedUser);
    }

    private ProviderProfile getProviderProfileById(Long providerProfileId) {
        return providerProfileRepository.findById(providerProfileId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Provider profile not found"));
    }

    private User getUserByIdOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private boolean hasRole(User user, RoleName roleName) {
        return user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == roleName);
    }

    private AdminProviderResponse toAdminProviderResponse(ProviderProfile providerProfile) {
        User user = providerProfile.getUser();

        return AdminProviderResponse.builder()
                .providerProfileId(providerProfile.getId())
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .enabled(user.isEnabled())
                .providerValidated(user.isProviderValidated())
                .businessName(providerProfile.getBusinessName())
                .businessType(providerProfile.getBusinessType())
                .city(providerProfile.getCity())
                .address(providerProfile.getAddress())
                .ice(providerProfile.getIce())
                .description(providerProfile.getDescription())
                .createdAt(providerProfile.getCreatedAt())
                .updatedAt(providerProfile.getUpdatedAt())
                .build();
    }

    private AdminUserResponse toAdminUserResponse(User user) {
        Set<String> roles = user.getRoles()
                .stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return AdminUserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .enabled(user.isEnabled())
                .providerValidated(user.isProviderValidated())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void ensureUserIsAdmin(User user) {
        boolean isAdmin = user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_ADMIN);

        if (!isAdmin) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only admins can access admin dashboard");
        }
    }

}