package com.reporting.portal.repository;

import com.reporting.portal.dto.DepartmentReportResponse;
import com.reporting.portal.entity.Department;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    @Query("""
            select new com.reporting.portal.dto.DepartmentReportResponse(
                d.departmentCode,
                d.name,
                d.managerName,
                count(u.id),
                d.location
            )
            from Department d
            left join User u on u.department = d
            where :search = ''
                or lower(d.departmentCode) like concat('%', :search, '%')
                or lower(d.name) like concat('%', :search, '%')
                or lower(d.managerName) like concat('%', :search, '%')
                or lower(d.location) like concat('%', :search, '%')
            group by d.id, d.departmentCode, d.name, d.managerName, d.location
            """)
    Page<DepartmentReportResponse> findDepartmentReports(@Param("search") String search, Pageable pageable);

    @Query("select max(d.updatedAt) from Department d")
    LocalDateTime findLastUpdated();
}
