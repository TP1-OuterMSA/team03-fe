import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { goalService } from '../api/goalService';
import { foodAnalyzeService } from '../api/foodAnalyzeService';
import { Goal } from '../interface/goal';
import { Food } from '../interface/foodAnalyze';

const CATEGORY_LABELS: Record<string, string> = {
  RICE: '밥',
  MAIN_DISH: '메인 반찬',
  SIDE_DISH: '사이드 반찬',
  SOUP: '국',
  DESSERT: '디저트'
};

const GoalDetailPage: React.FC = () => {
  const { foodId } = useParams<{ foodId: string }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<Food | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    targetScore: '',
    targetFrequency: ''
  });

  useEffect(() => {
    if (foodId) {
      fetchData(parseInt(foodId));
    }
  }, [foodId]);

  const fetchData = async (id: number) => {
    try {
      setLoading(true);
      const [foodData, goalsData] = await Promise.all([
        foodAnalyzeService.getFoodInfo(id),
        goalService.getGoals()
      ]);
      
      setFood(foodData);
      // 목표 목록에서 해당 음식의 목표를 찾습니다
      const foundGoal = goalsData.find(g => g.foodId === id);
      setGoal(foundGoal || null);
      
      if (foundGoal) {
        setFormData({
          targetScore: foundGoal.targetScore.toString(),
          targetFrequency: foundGoal.targetFrequency.toString()
        });
      }
      setError(null);
    } catch (error) {
      console.error('데이터 조회 실패:', error);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateGoal = async () => {
    if (!foodId) return;

    try {
      setLoading(true);
      await goalService.createGoal({
        foodId: parseInt(foodId),
        targetScore: parseFloat(formData.targetScore),
        targetFrequency: parseInt(formData.targetFrequency)
      });
      await fetchData(parseInt(foodId));
      setError(null);
      alert('목표가 생성되었습니다.');
    } catch (error) {
      setError('목표 생성에 실패했습니다.');
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async () => {
    if (!goal) return;

    try {
      setLoading(true);
      await goalService.updateGoal(goal.goalId, {
        targetScore: parseFloat(formData.targetScore),
        targetFrequency: parseInt(formData.targetFrequency)
      });
      await fetchData(parseInt(foodId!));
      setIsEditing(false);
      setError(null);
      alert('목표가 수정되었습니다.');
    } catch (error) {
      setError('목표 수정에 실패했습니다.');
      console.error('Error updating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!goal) return;

    if (!window.confirm('정말로 이 목표를 삭제하시겠습니까?')) {
      return;
    }

    try {
      setLoading(true);
      await goalService.deleteGoal(goal.goalId);
      alert('목표가 삭제되었습니다.');
      navigate('/team3/admin/goals');
    } catch (error) {
      setError('목표 삭제에 실패했습니다.');
      console.error('Error deleting goal:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <span>로딩 중...</span>
      </LoadingContainer>
    );
  }

  if (error || !food) {
    return <ErrorMessage>{error || '음식 정보를 찾을 수 없습니다.'}</ErrorMessage>;
  }

  return (
    <Container>
      <Header>
        <PageTitle>{food.name} 목표 관리</PageTitle>
        <ButtonGroup>
          <BackButton onClick={() => navigate('/team3/admin/goals')}>
            목록으로 돌아가기
          </BackButton>
        </ButtonGroup>
      </Header>

      <Content>
        <InfoSection>
          <SectionTitle>음식 정보</SectionTitle>
          <InfoCard>
            <InfoItem>
              <Label>카테고리</Label>
              <Value>{CATEGORY_LABELS[food.category] || food.category}</Value>
            </InfoItem>
          </InfoCard>
        </InfoSection>

        <GoalSection>
          <SectionTitle>목표 설정</SectionTitle>
          {goal ? (
            isEditing ? (
              <GoalForm>
                <FormGroup>
                  <Label>목표 평점</Label>
                  <Input
                    type="text"
                    name="targetScore"
                    value={formData.targetScore}
                    onChange={handleInputChange}
                    placeholder="0.0 ~ 5.0"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>목표 출현 빈도 (월)</Label>
                  <Input
                    type="text"
                    name="targetFrequency"
                    value={formData.targetFrequency}
                    onChange={handleInputChange}
                    placeholder="0 이상의 정수"
                  />
                </FormGroup>
                <ButtonGroup>
                  <SaveButton onClick={handleUpdateGoal}>저장</SaveButton>
                  <CancelButton onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      targetScore: goal.targetScore.toString(),
                      targetFrequency: goal.targetFrequency.toString()
                    });
                  }}>
                    취소
                  </CancelButton>
                </ButtonGroup>
              </GoalForm>
            ) : (
              <GoalCard>
                <GoalItem>
                  <Label>목표 평점</Label>
                  <Value>{goal.targetScore}점</Value>
                </GoalItem>
                <GoalItem>
                  <Label>목표 출현 빈도</Label>
                  <Value>월 {goal.targetFrequency}회</Value>
                </GoalItem>
                <ButtonGroup>
                  <EditButton onClick={() => setIsEditing(true)}>수정</EditButton>
                  <DeleteButton onClick={handleDeleteGoal}>삭제</DeleteButton>
                </ButtonGroup>
              </GoalCard>
            )
          ) : (
            <GoalForm>
              <FormGroup>
                <Label>목표 평점</Label>
                <Input
                  type="text"
                  name="targetScore"
                  value={formData.targetScore}
                  onChange={handleInputChange}
                  placeholder="0.0 ~ 5.0"
                />
              </FormGroup>
              <FormGroup>
                <Label>목표 출현 빈도 (월)</Label>
                <Input
                  type="text"
                  name="targetFrequency"
                  value={formData.targetFrequency}
                  onChange={handleInputChange}
                  placeholder="0 이상의 정수"
                />
              </FormGroup>
              <CreateButton onClick={handleCreateGoal}>목표 설정하기</CreateButton>
            </GoalForm>
          )}
        </GoalSection>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoSection = styled(Section)``;
const GoalSection = styled(Section)``;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
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
  color: #666;
`;

const Value = styled.span`
  color: #333;
`;

const GoalCard = styled(InfoCard)``;
const GoalItem = styled(InfoItem)``;

const GoalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const SaveButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #666;
  color: white;
`;

const EditButton = styled(Button)`
  background-color: #2196F3;
  color: white;
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;
  color: white;
`;

const CreateButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
  width: 100%;
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
  color: #f44336;
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
`;

export default GoalDetailPage; 