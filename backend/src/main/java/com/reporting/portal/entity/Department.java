package com.reporting.portal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_code", nullable = false, unique = true)
    private String departmentCode;

    @Column(nullable = false)
    private String name;

    @Column(name = "manager_name")
    private String managerName;

    private String location;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public String getName() {
        return name;
    }

    public String getManagerName() {
        return managerName;
    }

    public String getLocation() {
        return location;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
