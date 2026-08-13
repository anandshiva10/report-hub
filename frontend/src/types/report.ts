export type ReportType = "users" | "departments" | "projects";

export interface ReportMetadata {
  id: ReportType;
  name: string;
  description: string;
  recordCount: number;
  lastUpdated: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UserReportRow {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  createdDate: string;
}

export interface DepartmentReportRow {
  departmentId: string;
  departmentName: string;
  manager: string;
  employeeCount: number;
  location: string;
}

export interface ProjectReportRow {
  projectId: string;
  projectName: string;
  department: string;
  owner: string;
  status: string;
  startDate: string;
  endDate: string | null;
}

export type ReportRow = UserReportRow | DepartmentReportRow | ProjectReportRow;

export interface ReportQueryParams {
  page: number;
  size: number;
  search?: string;
  status?: string;
  sort?: string;
}
