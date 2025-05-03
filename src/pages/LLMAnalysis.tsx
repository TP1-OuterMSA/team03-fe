import { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { generateLLMReport, downloadLLMReportFile } from '../api/llmService';

function formatDateLocal(date: Date | null) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const LLMAnalysis = () => {
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [reportId, setReportId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    const [start, end] = selectedDates;
    if (!start || !end) {
      setError('시작일과 종료일을 모두 선택해주세요.');
      return;
    }
    setError(null);
    setLoading(true);
    setReport(null);
    setReportId(null);
    try {
      const data = await generateLLMReport({
        start_date: formatDateLocal(start),
        end_date: formatDateLocal(end),
      });
      if (data && data.report) {
        setReport(data.report);
        setReportId(data.report_id);
      } else {
        setError('데이터가 없어 보고서 생성에 실패했습니다.');
      }
    } catch {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!reportId) return;
    try {
      await downloadLLMReportFile(reportId);
    } catch (e: any) {
      alert('다운로드 실패: ' + (e?.message || '알 수 없는 오류'));
    }
  };

  const getButtonLabel = () => {
    const [start, end] = selectedDates;
    if (start && end) {
      return `${formatDateLocal(start)} ~ ${formatDateLocal(end)}`;
    }
    return '📅 날짜 선택';
  };

  return (
    <CardContainer>
      <h1>LLM 분석 보고서</h1>
      <ActionRow>
        <SelectButton onClick={() => setIsCalendarOpen(!isCalendarOpen)}>{getButtonLabel()}</SelectButton>
        {isCalendarOpen && (
          <CalendarPopup>
            <DatePicker
              selected={selectedDates[0]}
              onChange={(dates) => {
                setSelectedDates(dates as [Date | null, Date | null]);
                if (Array.isArray(dates) && dates[0] && dates[1]) {
                  setIsCalendarOpen(false);
                }
              }}
              startDate={selectedDates[0]}
              endDate={selectedDates[1]}
              selectsRange
              inline
              dateFormat="yyyy-MM-dd"
              locale={ko}
              isClearable
            />
          </CalendarPopup>
        )}
        <GenerateButton onClick={handleGenerateReport} disabled={loading || !selectedDates[0] || !selectedDates[1]}>
          {loading ? '생성 중...' : '보고서 생성'}
        </GenerateButton>
        <DownloadButton onClick={handleDownload} disabled={!reportId || loading}>
          보고서 다운로드
        </DownloadButton>
      </ActionRow>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <ReportBox>
        {loading ? (
          <ProgressView>
            <Spinner />
            <span>보고서를 생성 중입니다...</span>
          </ProgressView>
        ) : report ? (
          <ReportContainer>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {report}
            </ReactMarkdown>
          </ReportContainer>
        ) : (
          <EmptyMessage>생성된 보고서가 없습니다.</EmptyMessage>
        )}
      </ReportBox>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 2.5rem 2rem;
  max-width: 1090px;
  margin: 40px auto 0 auto;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  position: relative;
`;

const SelectButton = styled.button`
  background: #e7f5ff;
  color: rgba(0, 0, 0, 1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
  &:hover {
    border: 1px solid #228be6;
    background: #e7f5ff;
  }
`;

const CalendarPopup = styled.div`
  position: absolute;
  top: 48px;
  left: 0;
  z-index: 100;
  border-radius: 1rem;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const GenerateButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: #228be6;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:enabled {
    background: #1864ab;
  }
  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
  }
`;

const DownloadButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: #51cf66;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:enabled {
    background: #37b24d;
  }
  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  color: #fa5252;
  margin-bottom: 1rem;
`;

const ReportBox = styled.div`
  margin-top: 2rem;
  min-height: 300px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const ReportContainer = styled.div`
  width: 100%;
  word-break: break-all;
  line-height: 1.7;
  font-size: 1.1rem;
  overflow-x: auto;
`;

const EmptyMessage = styled.div`
  color: #999;
  font-size: 1.1rem;
`;

const ProgressView = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
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

export default LLMAnalysis;
