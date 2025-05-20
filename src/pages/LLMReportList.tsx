import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getAllReports, downloadReportFile } from '../api/reportService';
import { Report } from '../interface/report';

const LLMReportList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getAllReports();
      setReports(data);
    } catch {
      setError('보고서 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent, reportId: number) => {
    e.stopPropagation();
    try {
      await downloadReportFile(reportId);
    } catch (err) {
      alert('다운로드 실패: ' + (err instanceof Error ? err.message : '알 수 없는 오류'));
    }
  };

  const handleReportClick = (reportId: number) => {
    navigate(`/team3/admin/llm-report/${reportId}`);
  };

  return (
    <Container>
      <h1>LLM 분석 보고서 목록</h1>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading ? (
        <LoadingContainer>
          <Spinner />
          <span>로딩 중...</span>
        </LoadingContainer>
      ) : reports.length === 0 ? (
        <EmptyMessage>생성된 보고서가 없습니다.</EmptyMessage>
      ) : (
        <ReportList>
          {reports.map((report) => (
            <ReportCard key={report.id} onClick={() => handleReportClick(report.id)}>
              <ReportInfo>
                <ReportName>{report.name || '제목 없음'}</ReportName>
                <ReportDate>{report.createdAt}</ReportDate>
              </ReportInfo>
              <DownloadButton onClick={(e) => handleDownload(e, report.id)}>다운로드</DownloadButton>
            </ReportCard>
          ))}
        </ReportList>
      )}
    </Container>
  );
};

const Container = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 2.5rem 2rem;
  max-width: 1090px;
  margin: 40px auto 0 auto;
`;

const ReportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const ReportCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    background: #e9ecef;
  }
`;

const ReportInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ReportName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.1rem;
`;

const ReportDate = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const DownloadButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: #228be6;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1864ab;
  }
`;

const ErrorMessage = styled.div`
  color: #fa5252;
  margin: 1rem 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 5px solid #e7f5ff;
  border-top: 5px solid #228be6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 1.1rem;
  margin-top: 2rem;
`;

export default LLMReportList;
