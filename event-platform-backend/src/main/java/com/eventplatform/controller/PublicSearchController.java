package com.eventplatform.controller;

import com.eventplatform.dto.search.PackSearchResponse;
import com.eventplatform.service.PublicSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/public/search")
@RequiredArgsConstructor
public class PublicSearchController {

    private final PublicSearchService publicSearchService;

    @GetMapping("/packs")
    public ResponseEntity<List<PackSearchResponse>> searchPacks(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) String serviceType,
            @RequestParam(required = false) Integer guests,
            @RequestParam(required = false) BigDecimal maxBudget
    ) {
        List<PackSearchResponse> response = publicSearchService.searchPacks(
                city,
                eventType,
                serviceType,
                guests,
                maxBudget
        );

        return ResponseEntity.ok(response);
    }
}