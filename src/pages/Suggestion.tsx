import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Suggestion, SuggestionCategory } from '../interface/suggestion';
import { suggestionService } from '../api/suggestionService';

const SuggestionPage = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SuggestionCategory | 'ALL'>('ALL');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    nickName: '',
    category: 'RICE' as SuggestionCategory,
    content: '',
    foodName: '',
  });

  const categories: { value: SuggestionCategory; label: string }[] = [
    { value: 'RICE', label: '밥' },
    { value: 'MAIN_DISH', label: '메인 반찬' },
    { value: 'SIDE_DISH', label: '사이드 반찬' },
    { value: 'DESSERT', label: '디저트'},
    { value: 'SOUP', label: '국' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        title: formData.title,
        nickName: formData.nickName,
        category: formData.category,
        content: formData.content,
        foodName: formData.foodName
      };
            
      await suggestionService.createSuggestion(submitData);
      setShowCreateForm(false);
      setFormData({
        title: '',
        nickName: '',
        category: 'RICE',
        content: '',
        foodName: '',
      });
      alert('건의가 성공적으로 등록되었습니다.');
      fetchSuggestions();
    } catch (error: any) {
      console.error('건의 등록 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert('건의 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await suggestionService.getSuggestions();
      setSuggestions(response);
      setError(null);
    } catch (error) {
      console.error('건의 목록 조회 실패:', error);
      setError('건의 목록을 불러오는데 실패했습니다.');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestionId: number) => {
    navigate(`/team3/admin/suggestion/${suggestionId}`);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const filteredSuggestions = selectedCategory === 'ALL'
    ? suggestions
    : suggestions.filter(suggestion => suggestion.category === selectedCategory);

  return (
    <Container>
      <Header>
        <Title>건의함</Title>
        <Button onClick={() => setShowCreateForm(true)}>건의하기</Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {showCreateForm && (
        <CreateForm onSubmit={handleSubmit}>
          <FormTitle>건의하기</FormTitle>
          <Input
            type="text"
            placeholder="제목"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="닉네임 (선택)"
            value={formData.nickName}
            onChange={(e) => setFormData({ ...formData, nickName: e.target.value })}
          />
          <Input
            type="text"
            placeholder="음식 이름"
            value={formData.foodName}
            onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
          />
          <Select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as SuggestionCategory })}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
          <TextArea
            placeholder="내용을 입력하세요"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
          <ButtonGroup>
            <Button type="submit">제출하기</Button>
            <Button type="button" onClick={() => setShowCreateForm(false)}>취소</Button>
          </ButtonGroup>
        </CreateForm>
      )}

      <FilterSection>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as SuggestionCategory | 'ALL')}
        >
          <option value="ALL">전체</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </FilterSection>

      {loading ? (
        <LoadingContainer>
          <Spinner />
          <span>로딩 중...</span>
        </LoadingContainer>
      ) : filteredSuggestions.length === 0 ? (
        <EmptyMessage>등록된 건의가 없습니다.</EmptyMessage>
      ) : (
        <SuggestionList>
          {filteredSuggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} onClick={() => handleSuggestionClick(suggestion.id)}>
              <SuggestionHeader>
                <SuggestionTitle>{suggestion.title}</SuggestionTitle>
                <SuggestionMeta>
                  {suggestion.nickName && <span>{suggestion.nickName}</span>}
                  <span>{categories.find(c => c.value === suggestion.category)?.label}</span>
                  <span>{suggestion.createAt}</span>
                </SuggestionMeta>
              </SuggestionHeader>
              <SuggestionContent>{suggestion.content}</SuggestionContent>
            </SuggestionCard>
          ))}
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

const CreateForm = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  min-height: 150px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
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

export default SuggestionPage; 