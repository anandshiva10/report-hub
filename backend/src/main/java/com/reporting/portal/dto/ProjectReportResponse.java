package com.reporting.portal.dto;

import java.time.LocalDate;

public record ProjectReportResponse(
        String projectId,
        String projectName,
        String department,
        String owner,
        String status,
        LocalDate startDate,
        LocalDate endDate
) {
}
