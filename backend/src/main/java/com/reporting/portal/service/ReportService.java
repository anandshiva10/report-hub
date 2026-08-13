package com.reporting.portal.service;

import com.reporting.portal.dto.DepartmentReportResponse;
import com.reporting.portal.dto.PageResponse;
import com.reporting.portal.dto.ProjectReportResponse;
import com.reporting.portal.dto.ReportMetadataResponse;
import com.reporting.portal.dto.UserReportResponse;
import com.reporting.portal.entity.Project;
import com.reporting.portal.entity.ProjectStatus;
import com.reporting.portal.entity.User;
import com.reporting.portal.entity.UserStatus;
import com.reporting.portal.repository.DepartmentRepository;
import com.reporting.portal.repository.ProjectRepository;
import com.reporting.portal.repository.UserRepository;
import jakarta.persistence.criteria.JoinType;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class ReportService {
    private static final int MAX_PAGE_SIZE = 50;

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ProjectRepository projectRepository;

    public ReportService(
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            ProjectRepository projectRepository
    ) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.projectRepository = projectRepository;
    }

    public List<ReportMetadataResponse> getReports() {
        Instant updated = departmentRepository.findLastUpdated() == null
                ? Instant.now()
                : departmentRepository.findLastUpdated().toInstant(ZoneOffset.UTC);
        return List.of(
                new ReportMetadataResponse("users", "Users", "People in the system", userRepository.count(), updated),
                new ReportMetadataResponse("departments", "Departments", "Organization structure", departmentRepository.count(), updated),
                new ReportMetadataResponse("projects", "Projects", "Active and past work", projectRepository.count(), updated)
        );
    }

    public PageResponse<UserReportResponse> getUsers(
            int page,
            int size,
            String search,
            String status,
            String sort
    ) {
        Pageable pageable = pageable(page, size, normalizeUserSort(sort), "name", userSortFields());
        Page<UserReportResponse> result = userRepository
                .findAll(userSpec(search, status), pageable)
                .map(user -> new UserReportResponse(
                        user.getUserCode(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getStatus().name(),
                        user.getDepartment() == null ? null : user.getDepartment().getName(),
                        user.getCreatedAt()
                ));
        return pageResponse(result);
    }

    public PageResponse<DepartmentReportResponse> getDepartments(int page, int size, String search, String sort) {
        Pageable pageable = pageable(page, size, normalizeDepartmentSort(sort), "name", departmentSortFields());
        return pageResponse(departmentRepository.findDepartmentReports(searchTerm(search), pageable));
    }

    public PageResponse<ProjectReportResponse> getProjects(
            int page,
            int size,
            String search,
            String status,
            String sort
    ) {
        Pageable pageable = pageable(page, size, normalizeProjectSort(sort), "name", projectSortFields());
        Page<ProjectReportResponse> result = projectRepository
                .findAll(projectSpec(search, status), pageable)
                .map(project -> new ProjectReportResponse(
                        project.getProjectCode(),
                        project.getName(),
                        project.getDepartment().getName(),
                        project.getOwner().getName(),
                        project.getStatus().name(),
                        project.getStartDate(),
                        project.getEndDate()
                ));
        return pageResponse(result);
    }

    private Specification<User> userSpec(String search, String status) {
        return (root, query, cb) -> {
            if (query.getResultType() != Long.class) {
                root.fetch("department", JoinType.LEFT);
            }
            var predicate = cb.conjunction();
            if (StringUtils.hasText(search)) {
                String like = "%" + search.toLowerCase() + "%";
                var department = root.join("department", JoinType.LEFT);
                predicate = cb.and(predicate, cb.or(
                        cb.like(cb.lower(root.get("userCode")), like),
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("email")), like),
                        cb.like(cb.lower(root.get("role")), like),
                        cb.like(cb.lower(department.get("name")), like)
                ));
            }
            if (StringUtils.hasText(status)) {
                predicate = cb.and(predicate, cb.equal(root.get("status"), parseUserStatus(status)));
            }
            return predicate;
        };
    }

    private Specification<Project> projectSpec(String search, String status) {
        return (root, query, cb) -> {
            if (query.getResultType() != Long.class) {
                root.fetch("department", JoinType.LEFT);
                root.fetch("owner", JoinType.LEFT);
            }
            var predicate = cb.conjunction();
            if (StringUtils.hasText(search)) {
                String like = "%" + search.toLowerCase() + "%";
                var department = root.join("department", JoinType.LEFT);
                var owner = root.join("owner", JoinType.LEFT);
                predicate = cb.and(predicate, cb.or(
                        cb.like(cb.lower(root.get("projectCode")), like),
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(department.get("name")), like),
                        cb.like(cb.lower(owner.get("name")), like)
                ));
            }
            if (StringUtils.hasText(status)) {
                predicate = cb.and(predicate, cb.equal(root.get("status"), parseProjectStatus(status)));
            }
            return predicate;
        };
    }

    private UserStatus parseUserStatus(String status) {
        try {
            return UserStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported user status: " + status);
        }
    }

    private ProjectStatus parseProjectStatus(String status) {
        try {
            return ProjectStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported project status: " + status);
        }
    }

    private Pageable pageable(int page, int size, String sort, String defaultField, List<String> allowedFields) {
        if (page < 0) {
            throw new IllegalArgumentException("Page must be zero or greater");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("Size must be between 1 and " + MAX_PAGE_SIZE);
        }
        String field = defaultField;
        Sort.Direction direction = Sort.Direction.ASC;
        if (StringUtils.hasText(sort)) {
            String[] parts = sort.split(",");
            field = parts[0];
            if (!allowedFields.contains(field)) {
                throw new IllegalArgumentException("Unsupported sort field: " + field);
            }
            if (parts.length > 1) {
                direction = Sort.Direction.fromString(parts[1]);
            }
        }
        return PageRequest.of(page, size, Sort.by(direction, field));
    }

    private List<String> userSortFields() {
        return List.of("userCode", "name", "email", "role", "status", "createdAt");
    }

    private String normalizeUserSort(String sort) {
        if (!StringUtils.hasText(sort)) {
            return null;
        }
        String[] parts = sort.split(",");
        String field = switch (parts[0]) {
            case "userId" -> "userCode";
            case "createdDate" -> "createdAt";
            case "name", "email", "role", "status" -> parts[0];
            default -> throw new IllegalArgumentException("Unsupported sort field: " + parts[0]);
        };
        return parts.length > 1 ? field + "," + parts[1] : field;
    }

    private List<String> departmentSortFields() {
        return List.of("departmentCode", "name", "managerName", "location");
    }

    private String normalizeDepartmentSort(String sort) {
        if (!StringUtils.hasText(sort)) {
            return null;
        }
        String[] parts = sort.split(",");
        String field = switch (parts[0]) {
            case "departmentId" -> "departmentCode";
            case "departmentName" -> "name";
            case "manager" -> "managerName";
            case "location" -> "location";
            default -> throw new IllegalArgumentException("Unsupported sort field: " + parts[0]);
        };
        return parts.length > 1 ? field + "," + parts[1] : field;
    }

    private List<String> projectSortFields() {
        return List.of("projectCode", "name", "status", "startDate", "endDate");
    }

    private String normalizeProjectSort(String sort) {
        if (!StringUtils.hasText(sort)) {
            return null;
        }
        String[] parts = sort.split(",");
        String field = switch (parts[0]) {
            case "projectId" -> "projectCode";
            case "projectName" -> "name";
            case "status", "startDate", "endDate" -> parts[0];
            default -> throw new IllegalArgumentException("Unsupported sort field: " + parts[0]);
        };
        return parts.length > 1 ? field + "," + parts[1] : field;
    }

    private String searchTerm(String value) {
        return StringUtils.hasText(value) ? value.toLowerCase() : "";
    }

    private <T> PageResponse<T> pageResponse(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}
