export interface Report {
  id: number;
  report: string;
  name: string;
  createdAt: string;
}

export interface ReportListResponse {
  reports: Report[];
}
