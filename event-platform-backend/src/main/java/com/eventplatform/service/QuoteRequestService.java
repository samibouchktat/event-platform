package com.eventplatform.service;

import com.eventplatform.dto.quote.QuoteRequestCreateRequest;
import com.eventplatform.dto.quote.QuoteRequestResponse;
import com.eventplatform.dto.quote.QuoteRequestStatusUpdateRequest;

import java.util.List;

public interface QuoteRequestService {

    QuoteRequestResponse createQuoteRequest(QuoteRequestCreateRequest request, String authenticatedEmail);

    List<QuoteRequestResponse> getReceivedQuoteRequests(String providerEmail);

    QuoteRequestResponse getReceivedQuoteRequestById(String providerEmail, Long quoteRequestId);

    QuoteRequestResponse updateQuoteRequestStatus(
            String providerEmail,
            Long quoteRequestId,
            QuoteRequestStatusUpdateRequest request
    );

    List<QuoteRequestResponse> getClientQuoteRequests(String clientEmail);

    QuoteRequestResponse getClientQuoteRequestById(String clientEmail, Long quoteRequestId);
}