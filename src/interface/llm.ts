export interface LLMReportRequest {
  start_date: string;
  end_date: string;
}

export interface LLMReportResponse {
  report_id: number;
  message: string;
  error: string | null;
  report: string; // md 텍스트
}

export interface LLMReportDownloadRequest {
  report_id: number;
}

export type LLMReportDownloadResponse = string[];
