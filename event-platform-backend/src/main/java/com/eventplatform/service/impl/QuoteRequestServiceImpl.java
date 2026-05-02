package com.eventplatform.service.impl;

import com.eventplatform.dto.quote.QuoteRequestCreateRequest;
import com.eventplatform.dto.quote.QuoteRequestResponse;
import com.eventplatform.dto.quote.QuoteRequestStatusUpdateRequest;
import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.QuoteRequest;
import com.eventplatform.entity.QuoteRequestStatus;
import com.eventplatform.entity.RoleName;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.mapper.QuoteRequestMapper;
import com.eventplatform.repository.ProviderPackRepository;
import com.eventplatform.repository.ProviderProfileRepository;
import com.eventplatform.repository.QuoteRequestRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.QuoteRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.eventplatform.entity.NotificationType;
import com.eventplatform.service.NotificationService;


import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class QuoteRequestServiceImpl implements QuoteRequestService {

    private final QuoteRequestRepository quoteRequestRepository;
    private final ProviderPackRepository providerPackRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;
    private final QuoteRequestMapper quoteRequestMapper;

    private final NotificationService notificationService;
    @Override
    public QuoteRequestResponse createQuoteRequest(
            Long packId,
            QuoteRequestCreateRequest request,
            String authenticatedEmail
    ) {
        ProviderPack providerPack = providerPackRepository.findById(packId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Pack not found"
                ));

        if (!providerPack.isActive()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Pack is inactive");
        }

        validateGuestCount(providerPack, request.getGuestCount());

        User client = resolveOptionalClient(authenticatedEmail);

        QuoteRequest quoteRequest = QuoteRequest.builder()
                .client(client)
                .providerPack(providerPack)
                .providerProfile(providerPack.getProviderProfile())
                .customerName(clean(request.getCustomerName()))
                .customerEmail(cleanLower(request.getCustomerEmail()))
                .customerPhone(clean(request.getCustomerPhone()))
                .eventDate(request.getEventDate())
                .eventCity(clean(request.getEventCity()))
                .guestCount(request.getGuestCount())
                .estimatedBudget(request.getEstimatedBudget())
                .message(cleanNullable(request.getMessage()))
                .status(QuoteRequestStatus.PENDING)
                .build();

        QuoteRequest savedQuoteRequest = quoteRequestRepository.save(quoteRequest);
        notificationService.createNotification(
                providerPack.getProviderProfile().getUser(),
                NotificationType.QUOTE_REQUEST_CREATED,
                "Nouvelle demande de devis",
                "Vous avez reçu une nouvelle demande de devis pour le pack : " + providerPack.getName(),
                "QUOTE_REQUEST",
                savedQuoteRequest.getId()
        );
        return quoteRequestMapper.toResponse(savedQuoteRequest);

    }


    @Override
    @Transactional(readOnly = true)
    public List<QuoteRequestResponse> getReceivedQuoteRequests(String providerEmail) {
        ProviderProfile providerProfile = getProviderProfileForCurrentProvider(providerEmail);

        return quoteRequestRepository.findByProviderProfileOrderByCreatedAtDesc(providerProfile)
                .stream()
                .map(quoteRequestMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public QuoteRequestResponse getReceivedQuoteRequestById(String providerEmail, Long quoteRequestId) {
        ProviderProfile providerProfile = getProviderProfileForCurrentProvider(providerEmail);

        QuoteRequest quoteRequest = getQuoteRequestForProvider(quoteRequestId, providerProfile);

        return quoteRequestMapper.toResponse(quoteRequest);
    }

    @Override
    public QuoteRequestResponse updateQuoteRequestStatus(
            String providerEmail,
            Long quoteRequestId,
            QuoteRequestStatusUpdateRequest request
    ) {
        ProviderProfile providerProfile = getProviderProfileForCurrentProvider(providerEmail);

        QuoteRequest quoteRequest = getQuoteRequestForProvider(quoteRequestId, providerProfile);

        QuoteRequestStatus newStatus = resolveStatus(request.getStatus());

        quoteRequest.setStatus(newStatus);
        quoteRequest.setProviderResponse(cleanNullable(request.getProviderResponse()));

        QuoteRequest updatedQuoteRequest = quoteRequestRepository.save(quoteRequest);
        if (updatedQuoteRequest.getClient() != null) {
            notificationService.createNotification(
                    updatedQuoteRequest.getClient(),
                    NotificationType.QUOTE_REQUEST_STATUS_UPDATED,
                    "Mise à jour de votre demande de devis",
                    "Le prestataire a mis à jour votre demande de devis. Nouveau statut : " + newStatus.name(),
                    "QUOTE_REQUEST",
                    updatedQuoteRequest.getId()
            );
        }
        return quoteRequestMapper.toResponse(updatedQuoteRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuoteRequestResponse> getClientQuoteRequests(String clientEmail) {
        User client = getClientUserByEmail(clientEmail);

        return quoteRequestRepository.findByClientOrderByCreatedAtDesc(client)
                .stream()
                .map(quoteRequestMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public QuoteRequestResponse getClientQuoteRequestById(String clientEmail, Long quoteRequestId) {
        User client = getClientUserByEmail(clientEmail);

        QuoteRequest quoteRequest = quoteRequestRepository.findByIdAndClient(quoteRequestId, client)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Quote request not found"));

        return quoteRequestMapper.toResponse(quoteRequest);
    }

    private ProviderProfile getProviderProfileForCurrentProvider(String email) {
        User user = getUserByEmail(email);

        ensureUserIsProvider(user);

        return providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Provider profile not found. Please complete onboarding first"
                ));
    }

    private QuoteRequest getQuoteRequestForProvider(Long quoteRequestId, ProviderProfile providerProfile) {
        return quoteRequestRepository.findByIdAndProviderProfile(quoteRequestId, providerProfile)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Quote request not found"));
    }

    private User getClientUserByEmail(String email) {
        User user = getUserByEmail(email);

        ensureUserIsClient(user);

        return user;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void ensureUserIsProvider(User user) {
        boolean isProvider = user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_PROVIDER);

        if (!isProvider) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only providers can manage quote requests");
        }
    }

    private void ensureUserIsClient(User user) {
        boolean isClient = user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_CLIENT);

        if (!isClient) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only clients can access client quote requests");
        }
    }

    private User resolveOptionalClient(String authenticatedEmail) {
        if (authenticatedEmail == null || authenticatedEmail.trim().isEmpty()) {
            return null;
        }

        return userRepository.findByEmail(authenticatedEmail.trim().toLowerCase())
                .orElse(null);
    }

    private void validateGuestCount(ProviderPack providerPack, Integer guestCount) {
        if (guestCount == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Guest count is required");
        }

        if (providerPack.getMinGuests() != null && guestCount < providerPack.getMinGuests()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Guest count is below pack minimum capacity"
            );
        }

        if (providerPack.getMaxGuests() != null && guestCount > providerPack.getMaxGuests()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Guest count is above pack maximum capacity"
            );
        }
    }

    private QuoteRequestStatus resolveStatus(String status) {
        try {
            return QuoteRequestStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid quote request status");
        }
    }

    private String clean(String value) {
        return value.trim();
    }

    private String cleanLower(String value) {
        return value.trim().toLowerCase();
    }

    private String cleanNullable(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}