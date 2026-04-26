package com.eventplatform.service;

import com.eventplatform.dto.pack.ProviderPackRequest;
import com.eventplatform.dto.pack.ProviderPackResponse;

import java.util.List;

public interface ProviderPackService {

    ProviderPackResponse createPack(String email, ProviderPackRequest request);

    List<ProviderPackResponse> getMyPacks(String email);

    ProviderPackResponse getMyPackById(String email, Long packId);

    ProviderPackResponse updatePack(String email, Long packId, ProviderPackRequest request);

    void deletePack(String email, Long packId);

    ProviderPackResponse togglePackStatus(String email, Long packId);
}