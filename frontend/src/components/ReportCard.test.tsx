import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ReportCard } from "./ReportCard";

describe("ReportCard", () => {
  it("renders report details and navigation", () => {
    render(
      <MemoryRouter>
        <ReportCard
          report={{
            id: "users",
            name: "Users",
            description: "People in the system",
            recordCount: 35,
            lastUpdated: "2026-08-11T22:30:00Z"
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
    expect(screen.getByText("People in the system")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view report/i })).toHaveAttribute("href", "/reports/users");
  });
});
