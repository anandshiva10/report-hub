package com.reporting.portal.dto;

public record DepartmentReportResponse(
        String departmentId,
        String departmentName,
        String manager,
        long employeeCount,
        String location
) {
}
