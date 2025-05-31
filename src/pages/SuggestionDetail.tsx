import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Suggestion, SuggestionCategory } from '../interface/suggestion';
import { suggestionService } from '../api/suggestionService';
import { foodAnalyzeService } from '../api/foodAnalyzeService';
import { Food } from '../interface/foodAnalyze';

const SuggestionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [foods, setFoods] = useState<Food[]>([]);
  const [editForm, setEditForm] = useState({
    title: '',
    nickName: '',
    category: 'RICE' as SuggestionCategory,
    content: '',
    foodId: 0,
  });

  const categories: { value: SuggestionCategory; label: string }[] = [
    { value: 'RICE', label: '밥' },
    { value: 'MAIN_DISH', label: '메인 반찬' },
    { value: 'SIDE_DISH', label: '사이드 반찬' },
    { value: 'DESSERT', label: '디저트' },
    { value: 'SOUP', label: '국' }
  ];

  useEffect(() => {
    fetchSuggestionDetail();
    fetchFoods();
  }, [id]);

  const fetchFoods = async () => {
    try {
      const response = await foodAnalyzeService.getAllFoods();
      setFoods(response);
    } catch (error) {
      console.error('음식 목록 조회 실패:', error);
    }
  };

  const fetchSuggestionDetail = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const data = await suggestionService.getSuggestionById(parseInt(id));
      setSuggestion(data);
      setEditForm({
        title: data.title,
        nickName: data.nickName || '',
        category: data.category,
        content: data.content,
        foodId: data.foodId,
      });
      setError(null);
    } catch (error) {
      console.error('건의 상세 조회 실패:', error);
      setError('건의 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (suggestion) {
      setEditForm({
        title: suggestion.title,
        nickName: suggestion.nickName || '',
        category: suggestion.category,
        content: suggestion.content,
        foodId: suggestion.foodId,
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id) return;
      
      // 데이터 형식 검증
      if (!editForm.title.trim()) {
        alert('제목을 입력해주세요.');
        return;
      }
      if (!editForm.content.trim()) {
        alert('내용을 입력해주세요.');
        return;
      }
      if (!editForm.foodId || editForm.foodId === 0) {
        alert('음식을 선택해주세요.');
        return;
      }

      const requestData = {
        title: editForm.title.trim(),
        nickName: editForm.nickName.trim() || null,
        category: editForm.category,
        content: editForm.content.trim(),
        foodId: editForm.foodId
      };

      console.log('수정 요청 데이터:', requestData);
      
      await suggestionService.updateSuggestion(parseInt(id), requestData);
      await fetchSuggestionDetail();
      setIsEditing(false);
      alert('건의가 수정되었습니다.');
    } catch (error: any) {
      console.error('건의 수정 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert('음식을 선택해주세요.');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('정말로 이 건의를 삭제하시겠습니까?')) {
      try {
        await suggestionService.deleteSuggestion(parseInt(id));
        alert('건의가 삭제되었습니다.');
        navigate('/team3/admin/suggestion');
      } catch (error) {
        console.error('건의 삭제 실패:', error);
        alert('건의 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 음식을 카테고리별로 그룹화
  const groupedFoods = foods.reduce((acc, food) => {
    const category = food.category || '기타';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(food);
    return acc;
  }, {} as Record<string, Food[]>);

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <span>로딩 중...</span>
      </LoadingContainer>
    );
  }

  if (error || !suggestion) {
    return <ErrorMessage>{error || '건의를 찾을 수 없습니다.'}</ErrorMessage>;
  }

  return (
    <Container>
      <Header>
        <Title>건의 상세</Title>
        <ButtonGroup>
          <BackButton onClick={() => navigate('/team3/admin/suggestion')}>
            목록으로 돌아가기
          </BackButton>
          {!isEditing ? (
            <>
              <Button onClick={handleEdit}>수정</Button>
              <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
            </>
          ) : (
            <>
              <Button onClick={handleUpdate}>저장</Button>
              <Button onClick={handleCancel}>취소</Button>
            </>
          )}
        </ButtonGroup>
      </Header>

      {isEditing ? (
        <EditForm onSubmit={handleUpdate}>
          <Input
            type="text"
            placeholder="제목"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="닉네임 (선택)"
            value={editForm.nickName}
            onChange={(e) => setEditForm({ ...editForm, nickName: e.target.value })}
          />
          <Select
            value={editForm.foodId}
            onChange={(e) => {
              const selectedFood = foods.find(food => food.id === parseInt(e.target.value));
              setEditForm({
                ...editForm,
                foodId: selectedFood?.id || 0,
                category: selectedFood?.category as SuggestionCategory || 'RICE'
              });
            }}
          >
            <option value="0">음식을 선택하세요</option>
            {Object.entries(groupedFoods).map(([category, foods]) => (
              <optgroup key={category} label={category}>
                {foods.map(food => (
                  <option key={food.id} value={food.id}>
                    {food.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
          <TextArea
            placeholder="내용을 입력하세요"
            value={editForm.content}
            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
            required
          />
        </EditForm>
      ) : (
        <Content>
          <InfoSection>
            <InfoCard>
              <InfoItem>
                <Label>음식 이름</Label>
                <Value>{suggestion.foodName}</Value>
              </InfoItem>
              <InfoItem>
                <Label>작성자</Label>
                <Value>{suggestion.nickName || '익명'}</Value>
              </InfoItem>
              <InfoItem>
                <Label>카테고리</Label>
                <Value>{categories.find(c => c.value === suggestion.category)?.label}</Value>
              </InfoItem>
              <InfoItem>
                <Label>작성일</Label>
                <Value>{suggestion.createAt}</Value>
              </InfoItem>
            </InfoCard>
          </InfoSection>
          <MainSection>
            <TitleSection>
              <h2>{suggestion.title}</h2>
            </TitleSection>
            <ContentSection>
              <ContentText>{suggestion.content}</ContentText>
            </ContentSection>
            <AnswerSection>
              <AnswerTitle>답변 목록</AnswerTitle>
              {suggestion.answers && suggestion.answers.length > 0 ? (
                suggestion.answers.map((answer) => (
                  <AnswerCard key={`answer-${answer.answerId}`}>
                    <AnswerHeader>
                      <AnswerMeta>
                        <span>{answer.managerName}</span>
                        <span>{answer.createDate}</span>
                      </AnswerMeta>
                    </AnswerHeader>
                    <AnswerContent>{answer.content}</AnswerContent>
                  </AnswerCard>
                ))
              ) : (
                <EmptyMessage>답변이 없습니다</EmptyMessage>
              )}
            </AnswerSection>
          </MainSection>
        </Content>
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoSection = styled.div`
  width: 100%;
`;

const InfoCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 200px;
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  h3 {
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContentText = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.8;
  white-space: pre-wrap;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 1.1rem;
  min-height: 200px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const DeleteButton = styled(Button)`
  background-color: #fa5252;
  &:hover {
    background-color: #e03131;
  }
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
`;

const Label = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: 0.5rem;
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const BackButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.text.secondary};
  &:hover {
    background-color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const AnswerSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const AnswerTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const AnswerCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const AnswerHeader = styled.div`
  margin-bottom: 1rem;
`;

const AnswerMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const AnswerContent = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const EmptyMessage = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: 1rem;
`;

export default SuggestionDetailPage;