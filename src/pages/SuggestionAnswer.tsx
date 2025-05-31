import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Suggestion, SuggestionCategory } from '../interface/suggestion';
import { SuggestionAnswer, CreateSuggestionAnswerRequest, UpdateSuggestionAnswerRequest } from '../interface/suggestionAnswer';
import { suggestionService } from '../api/suggestionService';
import { suggestionAnswerService } from '../api/suggestionAnswerService';

const SuggestionAnswerPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateSuggestionAnswerRequest>({
    managerName: '',
    content: ''
  });
  const [editingAnswer, setEditingAnswer] = useState<SuggestionAnswer | null>(null);

  const categories: { value: SuggestionCategory; label: string }[] = [
    { value: 'RICE', label: '밥' },
    { value: 'MAIN_DISH', label: '메인 반찬' },
    { value: 'SIDE_DISH', label: '사이드 반찬' },
    { value: 'DESSERT', label: '디저트' },
    { value: 'SOUP', label: '국' }
  ];

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await suggestionService.getSuggestions();
      setSuggestions(response);
      setError(null);
    } catch (error) {
      console.error('건의 목록 조회 실패:', error);
      setError('건의 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestionDetail = async (suggestionId: number) => {
    try {
      setLoading(true);
      const data = await suggestionService.getSuggestionById(suggestionId);
      setSelectedSuggestion(data);
      setError(null);
    } catch (error) {
      console.error('건의 상세 조회 실패:', error);
      setError('건의 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    if (id) {
      fetchSuggestionDetail(parseInt(id));
    }
  }, [id]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    navigate(`/team3/admin/suggestion-answer/${suggestion.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuggestion) return;

    try {
      if (editingAnswer) {
        await suggestionAnswerService.updateAnswer(
          selectedSuggestion.id,
          editingAnswer.answerId,
          formData as UpdateSuggestionAnswerRequest
        );
        alert('답변이 수정되었습니다.');
      } else {
        await suggestionAnswerService.createAnswer(selectedSuggestion.id, formData);
        alert('답변이 등록되었습니다.');
      }
      setFormData({
        managerName: '',
        content: ''
      });
      setEditingAnswer(null);
      fetchSuggestionDetail(selectedSuggestion.id);
    } catch (error) {
      console.error('답변 처리 실패:', error);
      alert('답변 처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleEdit = (answer: SuggestionAnswer) => {
    setEditingAnswer(answer);
    setFormData({
      managerName: answer.managerName,
      content: answer.content
    });
  };

  const handleDelete = async (answer: SuggestionAnswer) => {
    if (!selectedSuggestion || !answer.answerId) return;
    if (!window.confirm('정말로 이 답변을 삭제하시겠습니까?')) return;

    try {
      await suggestionAnswerService.deleteAnswer(selectedSuggestion.id, answer.answerId);
      alert('답변이 삭제되었습니다.');
      fetchSuggestionDetail(selectedSuggestion.id);
    } catch (error) {
      console.error('답변 삭제 실패:', error);
      alert('답변 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    setEditingAnswer(null);
    setFormData({
      managerName: '',
      content: ''
    });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <span>로딩 중...</span>
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Header>
        <Title>건의함 답변</Title>
        <ButtonGroup>
          {selectedSuggestion && (
            <BackButton onClick={() => navigate('/team3/admin/suggestion-answer')}>
              목록으로 돌아가기
            </BackButton>
          )}
        </ButtonGroup>
      </Header>

      {selectedSuggestion ? (
        <Content>
          <InfoSection>
            <InfoCard>
              <InfoItem>
                <Label>음식 이름</Label>
                <Value>{selectedSuggestion.foodName}</Value>
              </InfoItem>
              <InfoItem>
                <Label>작성자</Label>
                <Value>{selectedSuggestion.nickName || '익명'}</Value>
              </InfoItem>
              <InfoItem>
                <Label>카테고리</Label>
                <Value>{categories.find(c => c.value === selectedSuggestion.category)?.label}</Value>
              </InfoItem>
              <InfoItem>
                <Label>작성일</Label>
                <Value>{selectedSuggestion.createAt}</Value>
              </InfoItem>
            </InfoCard>
          </InfoSection>

          <MainSection>
            <TitleSection>
              <h2>{selectedSuggestion.title}</h2>
            </TitleSection>
            <ContentSection>
              <ContentText>{selectedSuggestion.content}</ContentText>
            </ContentSection>

            <AnswerSection>
              <AnswerTitle>{editingAnswer ? '답변 수정' : '답변 작성'}</AnswerTitle>
              <AnswerForm onSubmit={handleSubmit}>
                <Input
                  type="text"
                  placeholder="관리자 이름"
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  required
                />
                <TextArea
                  placeholder="답변 내용을 입력하세요"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
                <ButtonGroup>
                  <Button type="submit">{editingAnswer ? '수정하기' : '답변 등록'}</Button>
                  {editingAnswer && (
                    <Button type="button" onClick={handleCancel}>취소</Button>
                  )}
                </ButtonGroup>
              </AnswerForm>

              <AnswerList>
                <h3>답변 목록</h3>
                {selectedSuggestion?.answers?.length > 0 ? (
                  (selectedSuggestion.answers as SuggestionAnswer[]).map((answer) => (
                    <AnswerCard key={`answer-${answer.answerId}`}>
                      <AnswerHeader>
                        <AnswerMeta>
                          <span>{answer.managerName}</span>
                          <span>{answer.createDate}</span>
                        </AnswerMeta>
                        <AnswerActions>
                          <ActionButton onClick={() => handleEdit(answer)}>수정</ActionButton>
                          <ActionButton $isDelete onClick={() => handleDelete(answer)}>삭제</ActionButton>
                        </AnswerActions>
                      </AnswerHeader>
                      <AnswerContent>{answer.content}</AnswerContent>
                    </AnswerCard>
                  ))
                ) : (
                  <EmptyMessage>답변이 없습니다</EmptyMessage>
                )}
              </AnswerList>
            </AnswerSection>
          </MainSection>
        </Content>
      ) : (
        <SuggestionList>
          {suggestions.length === 0 ? (
            <EmptyMessage>등록된 건의가 없습니다.</EmptyMessage>
          ) : (
            suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <SuggestionHeader>
                  <SuggestionTitle>{suggestion.title}</SuggestionTitle>
                  <SuggestionMeta>
                    {suggestion.nickName && <span>{suggestion.nickName}</span>}
                    <span>{suggestion.createAt}</span>
                  </SuggestionMeta>
                </SuggestionHeader>
                <SuggestionContent>{suggestion.content}</SuggestionContent>
                {suggestion.foodName && (
                  <FoodInfo>
                    <Label>관련 음식:</Label>
                    <Value>{suggestion.foodName}</Value>
                  </FoodInfo>
                )}
              </SuggestionCard>
            ))
          )}
        </SuggestionList>
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
  
  h2 {
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

const AnswerForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
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

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    opacity: 0.9;
  }
`;

const AnswerList = styled.div`
  margin-top: 2rem;

  h3 {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const AnswerCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const AnswerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AnswerMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const AnswerActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $isDelete?: boolean }>`
  padding: 0.25rem 0.5rem;
  background-color: ${({ $isDelete }) => ($isDelete ? '#fa5252' : '#40c057')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    opacity: 0.9;
  }
`;

const AnswerContent = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const SuggestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SuggestionCard = styled.div`
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    background: #e9ecef;
  }
`;

const SuggestionHeader = styled.div`
  margin-bottom: 1rem;
`;

const SuggestionTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const SuggestionMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const SuggestionContent = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
`;

const FoodInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Label = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
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

export default SuggestionAnswerPage; 