import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Chart from 'chart.js/auto';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  FoodInfo, 
  FoodCount, 
  FoodScore, 
  FoodEvaluationSummary,
  DateRange 
} from '../interface/foodAnalyze';
import { foodAnalyzeService } from '../api/foodAnalyzeService';

const FoodAnalyzeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [foodInfo, setFoodInfo] = useState<FoodInfo | null>(null);
  const [foodCount, setFoodCount] = useState<FoodCount | null>(null);
  const [foodScores, setFoodScores] = useState<FoodScore | null>(null);
  const [evaluationSummary, setEvaluationSummary] = useState<FoodEvaluationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    return {
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0]
    };
  });

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (id) {
      fetchFoodData(parseInt(id));
    }
  }, [id, dateRange]);

  useEffect(() => {
    if (foodScores) {
      createChart();
    }
  }, [foodScores]);

  const createChart = () => {
    if (!chartRef.current || !foodScores) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = Array.from({ length: foodScores.scores.length }, (_, i) => 
      new Date(new Date(foodScores.start_date).getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString()
    );

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '평점',
            data: foodScores.scores,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 5 } }
      }
    });
  };

  const fetchFoodData = async (foodId: number) => {
    try {
      setLoading(true);
      const [info, count, scores, summary] = await Promise.all([
        foodAnalyzeService.getFoodInfo(foodId),
        foodAnalyzeService.getFoodCount(foodId, dateRange),
        foodAnalyzeService.getFoodScores(foodId, dateRange),
        foodAnalyzeService.getFoodEvaluationSummary(foodId, dateRange)
      ]);

      setFoodInfo(info);
      setFoodCount(count);
      setFoodScores(scores);
      setEvaluationSummary(summary);
      setError(null);
    } catch (error) {
      console.error('음식 데이터 조회 실패:', error);
      setError('음식 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <span>로딩 중...</span>
      </LoadingContainer>
    );
  }

  if (error || !foodInfo) {
    return <ErrorMessage>{error || '음식 정보를 찾을 수 없습니다.'}</ErrorMessage>;
  }

  return (
    <Container>
      <Header>
        <PageTitle>{foodInfo.name} 통계</PageTitle>
        <ButtonGroup>
          <BackButton onClick={() => navigate('/team3/admin/food-analyze')}>
            목록으로 돌아가기
          </BackButton>
        </ButtonGroup>
      </Header>

      <DateRangeContainer>
        <DateInput
          type="date"
          name="startDate"
          value={dateRange.startDate}
          onChange={handleDateRangeChange}
        />
        <span>~</span>
        <DateInput
          type="date"
          name="endDate"
          value={dateRange.endDate}
          onChange={handleDateRangeChange}
        />
      </DateRangeContainer>

      <TopGrid>
        {/* 1. 음식 정보 섹션 */}
        <Section>
          <SectionTitle>음식 정보</SectionTitle>
          <InfoCard>
            <InfoItem>
              <Label>카테고리</Label>
              <Value>{foodInfo.category}</Value>
            </InfoItem>
            <InfoItem>
              <Label>영양 정보</Label>
              <Value>{foodInfo.nutrition}</Value>
            </InfoItem>
            <InfoItem>
              <Label>칼로리</Label>
              <Value>{foodInfo.calorie}kcal</Value>
            </InfoItem>
            <InfoItem>
              <Label>알레르기</Label>
              <Value>{foodInfo.allergy}</Value>
            </InfoItem>
            {foodInfo.subCategory && (
              <InfoItem>
                <Label>서브 카테고리</Label>
                <Value>{foodInfo.subCategory}</Value>
              </InfoItem>
            )}
          </InfoCard>
        </Section>

        {/* 2. 출현 횟수 섹션 */}
        <Section>
          <SectionTitle>출현 횟수</SectionTitle>
          <CountCard>
            <CountValue>{foodCount?.count || 0}회</CountValue>
            <CountPeriod>
              {dateRange.startDate} ~ {dateRange.endDate}
            </CountPeriod>
          </CountCard>
        </Section>
      </TopGrid>

      {/* 3. 평점 그래프 섹션 */}
      <Section>
        <SectionTitle>평점 추이</SectionTitle>
        <ChartCard>
          <canvas ref={chartRef}></canvas>
        </ChartCard>
      </Section>

      {/* 4. 피드백 요약 섹션 */}
      <Section>
        <SectionTitle>피드백 요약</SectionTitle>
        <ReportBox>
          {evaluationSummary?.error ? (
            <ErrorMessage>{evaluationSummary.error}</ErrorMessage>
          ) : (
            <ReportContainer>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {evaluationSummary?.summary || '피드백이 없습니다.'}
              </ReactMarkdown>
              <SummaryFooter>
                <TotalFeedbacks>
                  총 {evaluationSummary?.evaluationCount || 0}개의 피드백
                </TotalFeedbacks>
              </SummaryFooter>
            </ReportContainer>
          )}
        </ReportBox>
      </Section>
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.text.secondary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const DateInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const InfoCard = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CountCard = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CountValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: 1rem;
`;

const CountPeriod = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  font-size: 0.9rem;
`;

const ChartCard = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;
`;

const ReportBox = styled.div`
  margin-top: 1rem;
  min-height: 300px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
`;

const ReportContainer = styled.div`
  font-family: 'Gmarket-Medium', sans-serif;
  line-height: 1.6;
  color: #222;
  width: 100%;

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

const SummaryFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TotalFeedbacks = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
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

const ErrorMessage = styled.div`
  color: #fa5252;
  margin: 1rem 0;
`;

export default FoodAnalyzeDetailPage; 