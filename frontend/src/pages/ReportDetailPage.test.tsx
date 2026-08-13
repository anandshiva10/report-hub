import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ReportDetailPage } from "./ReportDetailPage";

vi.mock("../api/reportsApi", () => ({
  getReportData: vi.fn(async () => ({
    content: [
      {
        userId: "USR-001",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "Administrator",
        status: "ACTIVE",
        department: "Engineering",
        createdDate: "2026-01-12T10:30:00"
      }
    ],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1
  }))
}));

describe("ReportDetailPage", () => {
  it("renders report data", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/reports/users"]}>
          <Routes>
            <Route path="/reports/:reportType" element={<ReportDetailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Sarah Johnson")).toBeInTheDocument();
    expect(screen.getByText("sarah.johnson@example.com")).toBeInTheDocument();
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
  });
});
