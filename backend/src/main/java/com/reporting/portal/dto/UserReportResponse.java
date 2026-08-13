package com.reporting.portal.dto;

import java.time.LocalDateTime;

public record UserReportResponse(
        String userId,
        String name,
        String email,
        String role,
        String status,
        String department,
        LocalDateTime createdDate
) {
}
