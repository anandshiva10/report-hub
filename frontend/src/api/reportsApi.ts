import { apiClient } from "./client";
import type {
  DepartmentReportRow,
  PageResponse,
  ProjectReportRow,
  ReportMetadata,
  ReportQueryParams,
  ReportRow,
  ReportType,
  UserReportRow
} from "../types/report";

export async function getReports() {
  const { data } = await apiClient.get<ReportMetadata[]>("/reports");
  return data;
}

export async function getReportData(reportType: ReportType, params: ReportQueryParams) {
  const { data } = await apiClient.get<PageResponse<ReportRow>>(`/reports/${reportType}`, {
    params: {
      page: params.page,
      size: params.size,
      search: params.search || undefined,
      status: params.status || undefined,
      sort: params.sort || undefined
    }
  });
  return data;
}

export type { DepartmentReportRow, ProjectReportRow, UserReportRow };
