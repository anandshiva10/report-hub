import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReportsLandingPage } from "./ReportsLandingPage";

vi.mock("../api/reportsApi", () => ({
  getReports: vi.fn(async () => [
    { id: "users", name: "Users", description: "People in the system", recordCount: 35, lastUpdated: "2026-08-11T22:30:00Z" },
    { id: "departments", name: "Departments", description: "Organization structure", recordCount: 6, lastUpdated: "2026-08-11T22:30:00Z" },
    { id: "projects", name: "Projects", description: "Active and past work", recordCount: 20, lastUpdated: "2026-08-11T22:30:00Z" }
  ])
}));

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ReportsLandingPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ReportsLandingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows all reports and filters by name", async () => {
    renderPage();

    expect(await screen.findByRole("heading", { name: "Users" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Departments" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText("Search reports"), "pro");

    expect(screen.queryByRole("heading", { name: "Users" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
  });
});
