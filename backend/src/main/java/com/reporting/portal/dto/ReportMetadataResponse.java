package com.reporting.portal.dto;

import java.time.Instant;

public record ReportMetadataResponse(
        String id,
        String name,
        String description,
        long recordCount,
        Instant lastUpdated
) {
}
