package com.eventplatform.service.impl;

import com.eventplatform.dto.booking.BookingCreateFromQuoteRequest;
import com.eventplatform.dto.booking.BookingResponse;
import com.eventplatform.dto.booking.BookingStatusUpdateRequest;
import com.eventplatform.entity.Booking;
import com.eventplatform.entity.BookingStatus;
import com.eventplatform.entity.ProviderPack;
import com.eventplatform.entity.ProviderProfile;
import com.eventplatform.entity.QuoteRequest;
import com.eventplatform.entity.QuoteRequestStatus;
import com.eventplatform.entity.RoleName;
import com.eventplatform.entity.User;
import com.eventplatform.exception.ApiException;
import com.eventplatform.mapper.BookingMapper;
import com.eventplatform.repository.BookingRepository;
import com.eventplatform.repository.ProviderProfileRepository;
import com.eventplatform.repository.QuoteRequestRepository;
import com.eventplatform.repository.UserRepository;
import com.eventplatform.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final QuoteRequestRepository quoteRequestRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;

    @Override
    public BookingResponse createBookingFromQuoteRequest(
            String providerEmail,
            Long quoteRequestId,
            BookingCreateFromQuoteRequest request
    ) {
        ProviderProfile providerProfile = getProviderProfileForCurrentProvider(providerEmail);

        QuoteRequest quoteRequest = quoteRequestRepository
                .findByIdAndProviderProfile(quoteRequestId, providerProfile)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Quote request not found"));

        if (quoteRequest.getStatus() != QuoteRequestStatus.ACCEPTED) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Only accepted quote requests can be converted to booking"
            );
        }

        if (bookingRepository.existsByQuoteRequest(quoteRequest)) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Booking already exists for this quote request"
            );
        }

        ProviderPack providerPack = quoteRequest.getProviderPack();

        BigDecimal totalAmount = resolveTotalAmount(request, providerPack);
        BigDecimal depositAmount = request.getDepositAmount();

        validateAmounts(totalAmount, depositAmount);

        Booking booking = Booking.builder()
                .quoteRequest(quoteRequest)
                .client(quoteRequest.getClient())
                .providerPack(providerPack)
                .providerProfile(providerProfile)
                .eventDate(quoteRequest.getEventDate())
                .eventCity(quoteRequest.getEventCity())
                .guestCount(quoteRequest.getGuestCount())
                .totalAmount(totalAmount)
                .depositAmount(depositAmount)
                .status(BookingStatus.PENDING_DEPOSIT)
                .providerNotes(cleanNullable(request.getProviderNotes()))
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        return bookingMapper.toResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getProviderBookings(String providerEmail) {
        ProviderProfile providerProfile = getProviderProfileForCurrentProvider(providerEmail);

        return bookingRepository.findByProviderProfileOrderByEventDateAsc(providerProfile)
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getProviderBookingById(String providerEmail, Long bookingId) {
        ProviderProfile providerProfile = getProviderProfileForCurrentProvider(providerEmail);

        Booking booking = getBookingForProvider(bookingId, providerProfile);

        return bookingMapper.toResponse(booking);
    }

    @Override
    public BookingResponse updateBookingStatus(
            String providerEmail,
            Long bookingId,
            BookingStatusUpdateRequest request
    ) {
        ProviderProfile providerProfile = getProviderProfileForCurrentProvider(providerEmail);

        Booking booking = getBookingForProvider(bookingId, providerProfile);

        BookingStatus newStatus = resolveBookingStatus(request.getStatus());

        booking.setStatus(newStatus);
        booking.setProviderNotes(cleanNullable(request.getProviderNotes()));

        Booking updatedBooking = bookingRepository.save(booking);

        return bookingMapper.toResponse(updatedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getClientBookings(String clientEmail) {
        User client = getClientUserByEmail(clientEmail);

        return bookingRepository.findByClientOrderByEventDateDesc(client)
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getClientBookingById(String clientEmail, Long bookingId) {
        User client = getClientUserByEmail(clientEmail);

        Booking booking = bookingRepository.findByIdAndClient(bookingId, client)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));

        return bookingMapper.toResponse(booking);
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
            throw new ApiException(HttpStatus.FORBIDDEN, "Only providers can manage bookings");
        }
    }

    private void ensureUserIsClient(User user) {
        boolean isClient = user.getRoles()
                .stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_CLIENT);

        if (!isClient) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only clients can access client bookings");
        }
    }

    private Booking getBookingForProvider(Long bookingId, ProviderProfile providerProfile) {
        return bookingRepository.findByIdAndProviderProfile(bookingId, providerProfile)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found"));
    }

    private BigDecimal resolveTotalAmount(
            BookingCreateFromQuoteRequest request,
            ProviderPack providerPack
    ) {
        if (request.getTotalAmount() != null) {
            return request.getTotalAmount();
        }

        return providerPack.getPrice();
    }

    private void validateAmounts(BigDecimal totalAmount, BigDecimal depositAmount) {
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Total amount must be greater than 0");
        }

        if (depositAmount == null) {
            return;
        }

        if (depositAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Deposit amount must be greater than 0");
        }

        if (depositAmount.compareTo(totalAmount) > 0) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "Deposit amount must be less than or equal to total amount"
            );
        }
    }

    private BookingStatus resolveBookingStatus(String status) {
        try {
            return BookingStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid booking status");
        }
    }

    private String cleanNullable(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}