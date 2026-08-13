package com.reporting.portal;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.lessThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ReportControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void reportsMetadataReturnsThreeReports() throws Exception {
        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].id", is("users")))
                .andExpect(jsonPath("$[1].id", is("departments")))
                .andExpect(jsonPath("$[2].id", is("projects")));
    }

    @Test
    void usersReportReturnsPaginatedRows() throws Exception {
        mockMvc.perform(get("/api/reports/users?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(10)))
                .andExpect(jsonPath("$.totalElements", is(35)));
    }

    @Test
    void userSearchFiltersRows() throws Exception {
        mockMvc.perform(get("/api/reports/users?search=sarah"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.content[0].name", is("Sarah Johnson")));
    }

    @Test
    void departmentsReportIncludesCalculatedEmployeeCount() throws Exception {
        mockMvc.perform(get("/api/reports/departments?search=Engineering"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].departmentName", is("Engineering")))
                .andExpect(jsonPath("$.content[0].employeeCount", is(9)));
    }

    @Test
    void projectStatusFilterWorks() throws Exception {
        mockMvc.perform(get("/api/reports/projects?status=ACTIVE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()", lessThanOrEqualTo(10)))
                .andExpect(jsonPath("$.totalElements", is(9)));
    }

    @Test
    void invalidParametersReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/reports/projects?size=100"))
                .andExpect(status().isBadRequest());
    }
}
