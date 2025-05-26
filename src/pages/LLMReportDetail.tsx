import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getAllReports } from '../api/reportService';
import { Report } from '../interface/report';

const LLMReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const reports = await getAllReports();
      const foundReport = reports.find((r) => r.id === Number(id));
      if (foundReport) {
        setReport(foundReport);
      } else {
        setError('보고서를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError('보고서를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/team3/admin/llm-report-list')}>← 목록으로 돌아가기</BackButton>
        <Title>{report?.name || '제목 없음'}</Title>
      </Header>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading ? (
        <LoadingContainer>
          <Spinner />
          <span>로딩 중...</span>
        </LoadingContainer>
      ) : report ? (
        <ReportContainer>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {report.report}
          </ReactMarkdown>
        </ReportContainer>
      ) : (
        <EmptyMessage>보고서를 찾을 수 없습니다.</EmptyMessage>
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

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #228be6;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  text-align: left;
  width: fit-content;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 1.8rem;
`;

const ReportContainer = styled.div`
  font-family: 'Gmarket-Medium', sans-serif;
  line-height: 1.6;
  color: #222;

  h1 {
    color: #333366;
    font-size: 2rem;
    margin-top: 1.5em;
    margin-bottom: 0.7em;
  }
  h2 {
    color: #336699;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
    margin-top: 1.2em;
    margin-bottom: 0.7em;
    font-size: 1.5rem;
  }
  h3 {
    color: #5588bb;
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-size: 1.2rem;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 20px 0;
    font-size: 1rem;
  }
  th,
  td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }
  th {
    background-color: #f2f2f2;
  }
  blockquote {
    background: #f9f9f9;
    border-left: 10px solid #ccc;
    margin: 1.5em 10px;
    padding: 0.5em 10px;
    color: #555;
  }
  code {
    background: #f4f4f4;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
    font-size: 0.98em;
  }
  pre {
    background: #f4f4f4;
    padding: 10px;
    border-radius: 3px;
    overflow-x: auto;
    font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
    font-size: 0.98em;
  }
  ul,
  ol {
    margin: 1em 0 1em 2em;
  }
  strong {
    font-weight: bold;
  }
  em {
    font-style: italic;
  }
  p {
    margin: 0.7em 0;
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

export default LLMReportDetail;
