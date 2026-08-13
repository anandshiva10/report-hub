import { useQuery } from "@tanstack/react-query";
import { getReportData, getReports } from "../api/reportsApi";
import type { ReportQueryParams, ReportType } from "../types/report";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReports
  });
}

export function useReportData(reportType: ReportType, params: ReportQueryParams) {
  return useQuery({
    queryKey: ["report", reportType, params],
    queryFn: () => getReportData(reportType, params),
    placeholderData: (previous) => previous
  });
}
