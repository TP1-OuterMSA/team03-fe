import { api } from './axios';
import { Report } from '../interface/report';

const baseURL = import.meta.env.VITE_API_URL;

export const getAllReports = async (): Promise<Report[]> => {
  const response = await api.get<Report[]>('/api/team3/analytics/aireport/get-all');
  return response.data;
};

export const downloadReportFile = async (reportId: number): Promise<void> => {
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
  a.download = `report-${reportId}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
