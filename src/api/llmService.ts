import { api } from './axios';
import {
  LLMReportRequest,
  LLMReportResponse,
  LLMReportDownloadRequest,
  LLMReportDownloadResponse,
} from '../interface/llm';

const baseURL = import.meta.env.VITE_API_URL;

export const generateLLMReport = async (body: LLMReportRequest): Promise<LLMReportResponse> => {
  const response = await api.post('/api/team3/analytics/aireport/generate', body);
  return response.data;
};

export const downloadLLMReport = async (body: LLMReportDownloadRequest): Promise<LLMReportDownloadResponse> => {
  const response = await api.post('/api/team3/analytics/aireport/download', body);
  return response.data;
};

export const downloadLLMReportFile = async (reportId: number): Promise<void> => {
  const response = await fetch(`${baseURL}/api/team3/analytics/aireport/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ report_id: reportId }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'report.pdf';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
