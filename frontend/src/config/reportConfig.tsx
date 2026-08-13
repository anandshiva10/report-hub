import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "../components/StatusBadge";
import type { DepartmentReportRow, ProjectReportRow, ReportRow, ReportType, UserReportRow } from "../types/report";
import { formatDate, formatDateTime } from "../utils/formatters";

interface ReportConfig<T extends ReportRow> {
  title: string;
  description: string;
  searchPlaceholder: string;
  columns: ColumnDef<T>[];
  statusOptions?: string[];
}

export const reportConfigs: Record<ReportType, ReportConfig<ReportRow>> = {
  users: {
    title: "Users",
    description: "People in the system",
    searchPlaceholder: "Search users, email, role, or department",
    statusOptions: ["ACTIVE", "INACTIVE", "SUSPENDED"],
    columns: [
      { accessorKey: "userId", header: "User ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "department", header: "Department" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge value={(row.original as UserReportRow).status} />
      },
      {
        accessorKey: "createdDate",
        header: "Created Date",
        cell: ({ row }) => formatDateTime((row.original as UserReportRow).createdDate)
      }
    ] as ColumnDef<ReportRow>[]
  },
  departments: {
    title: "Departments",
    description: "Organization structure",
    searchPlaceholder: "Search departments, managers, or locations",
    columns: [
      { accessorKey: "departmentId", header: "Department ID" },
      { accessorKey: "departmentName", header: "Department Name" },
      { accessorKey: "manager", header: "Manager" },
      { accessorKey: "employeeCount", header: "Employee Count" },
      { accessorKey: "location", header: "Location" }
    ] as ColumnDef<ReportRow>[]
  },
  projects: {
    title: "Projects",
    description: "Active and past work",
    searchPlaceholder: "Search projects, owners, or departments",
    statusOptions: ["PLANNED", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
    columns: [
      { accessorKey: "projectId", header: "Project ID" },
      { accessorKey: "projectName", header: "Project Name" },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "owner", header: "Owner" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge value={(row.original as ProjectReportRow).status} />
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => formatDate((row.original as ProjectReportRow).startDate)
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ row }) => formatDate((row.original as ProjectReportRow).endDate)
      }
    ] as ColumnDef<ReportRow>[]
  }
};

export function isReportType(value: string | undefined): value is ReportType {
  return value === "users" || value === "departments" || value === "projects";
}
