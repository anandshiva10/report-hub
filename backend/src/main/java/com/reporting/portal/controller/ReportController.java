package com.reporting.portal.controller;

import com.reporting.portal.dto.DepartmentReportResponse;
import com.reporting.portal.dto.PageResponse;
import com.reporting.portal.dto.ProjectReportResponse;
import com.reporting.portal.dto.ReportMetadataResponse;
import com.reporting.portal.dto.UserReportResponse;
import com.reporting.portal.service.ReportService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<ReportMetadataResponse> getReports() {
        return reportService.getReports();
    }

    @GetMapping("/users")
    public PageResponse<UserReportResponse> getUsers(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sort
    ) {
        return reportService.getUsers(page, size, search, status, sort);
    }

    @GetMapping("/departments")
    public PageResponse<DepartmentReportResponse> getDepartments(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort
    ) {
        return reportService.getDepartments(page, size, search, sort);
    }

    @GetMapping("/projects")
    public PageResponse<ProjectReportResponse> getProjects(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sort
    ) {
        return reportService.getProjects(page, size, search, status, sort);
    }
}
