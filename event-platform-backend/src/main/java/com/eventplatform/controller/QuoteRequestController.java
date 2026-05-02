package com.eventplatform.controller;

import com.eventplatform.dto.quote.QuoteRequestCreateRequest;
import com.eventplatform.dto.quote.QuoteRequestResponse;
import com.eventplatform.dto.quote.QuoteRequestStatusUpdateRequest;
import com.eventplatform.service.QuoteRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class QuoteRequestController {

    private final QuoteRequestService quoteRequestService;

    @PostMapping("/api/public/packs/{packId}/quote-requests")
    public ResponseEntity<QuoteRequestResponse> createQuoteRequest(
            @PathVariable Long packId,
            @Valid @RequestBody QuoteRequestCreateRequest request,
            Authentication authentication
    ) {
        String authenticatedEmail = authentication != null ? authentication.getName() : null;

        QuoteRequestResponse response = quoteRequestService.createQuoteRequest(
                packId,
                request,
                authenticatedEmail
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/provider/quote-requests")
    public ResponseEntity<List<QuoteRequestResponse>> getReceivedQuoteRequests(
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        List<QuoteRequestResponse> response =
                quoteRequestService.getReceivedQuoteRequests(providerEmail);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/provider/quote-requests/{id}")
    public ResponseEntity<QuoteRequestResponse> getReceivedQuoteRequestById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        QuoteRequestResponse response =
                quoteRequestService.getReceivedQuoteRequestById(providerEmail, id);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/api/provider/quote-requests/{id}/status")
    public ResponseEntity<QuoteRequestResponse> updateQuoteRequestStatus(
            @PathVariable Long id,
            @Valid @RequestBody QuoteRequestStatusUpdateRequest request,
            Authentication authentication
    ) {
        String providerEmail = authentication.getName();

        QuoteRequestResponse response =
                quoteRequestService.updateQuoteRequestStatus(providerEmail, id, request);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/api/client/quote-requests")
    public ResponseEntity<List<QuoteRequestResponse>> getClientQuoteRequests(
            Authentication authentication
    ) {
        String clientEmail = authentication.getName();

        List<QuoteRequestResponse> response =
                quoteRequestService.getClientQuoteRequests(clientEmail);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/client/quote-requests/{id}")
    public ResponseEntity<QuoteRequestResponse> getClientQuoteRequestById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String clientEmail = authentication.getName();

        QuoteRequestResponse response =
                quoteRequestService.getClientQuoteRequestById(clientEmail, id);

        return ResponseEntity.ok(response);
    }
}