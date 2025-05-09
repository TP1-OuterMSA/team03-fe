import React from 'react';
import styled from 'styled-components';
import { PeriodSelectorProps } from '../../interface/frequencyMenu';
import { PeriodType } from '../../interface/wantedMenu';

const PeriodSelector = ({
    periodCategory,
    selectedPeriod,
    onCategoryChange,
    onPeriodChange,
    }: PeriodSelectorProps) => {

    const currentYear = new Date().getFullYear();

    return (
    <Container>
        <Tabs>
        <Tab $isActive={periodCategory === 'semester'} onClick={() => onCategoryChange('semester')}>
            학기별 보기
        </Tab>
        <Tab $isActive={periodCategory === 'month'} onClick={() => onCategoryChange('month')}>
            월별 보기
        </Tab>
        </Tabs>

      <OptionsWrapper>
        {periodCategory === 'semester' ? (
          <SemesterGrid>
            <OptionBox
              $isActive={selectedPeriod === 'FIRST_SEMESTER'}
              onClick={() => onPeriodChange('FIRST_SEMESTER')}
            >
              <OptionTitle>1학기</OptionTitle>
              <OptionSubtitle>{currentYear}년 3월 ~ 8월</OptionSubtitle>
            </OptionBox>
            <OptionBox
              $isActive={selectedPeriod === 'SECOND_SEMESTER'}
              onClick={() => onPeriodChange('SECOND_SEMESTER')}
            >
              <OptionTitle>2학기</OptionTitle>
              <OptionSubtitle>
                {currentYear}년 9월 ~ {currentYear + 1}년 2월
              </OptionSubtitle>
            </OptionBox>
          </SemesterGrid>
        ) : (
          <MonthGrid>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <MonthBox
                key={month}
                $isActive={selectedPeriod === `MONTH_${month}`}
                onClick={() => onPeriodChange(`MONTH_${month}` as PeriodType)}
              >
                {month}월
              </MonthBox>
            ))}
          </MonthGrid>
        )}
      </OptionsWrapper>
    </Container>
  );
};

export default PeriodSelector;

// styled components
const Container = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.div<{ $isActive: boolean }>`
  flex: 1;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  background-color: ${(props) => (props.$isActive ? '#f8f9fa' : 'transparent')};
  font-weight: ${(props) => (props.$isActive ? '600' : '400')};
  color: ${(props) => (props.$isActive ? '#228be6' : '#495057')};
  border-bottom: ${(props) => (props.$isActive ? '2px solid #228be6' : 'none')};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$isActive ? '#f8f9fa' : '#f1f3f5')};
  }
`;

const OptionsWrapper = styled.div`
  padding: 1.5rem;
`;

const SemesterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const OptionBox = styled.div<{ $isActive: boolean }>`
  padding: 1.5rem;
  border-radius: 8px;
  background-color: ${(props) => (props.$isActive ? '#e7f5ff' : '#f8f9fa')};
  border: 2px solid ${(props) => (props.$isActive ? '#228be6' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const OptionTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const OptionSubtitle = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MonthBox = styled.div<{ $isActive: boolean }>`
  padding: 1rem 0.5rem;
  text-align: center;
  border-radius: 8px;
  background-color: ${(props) => (props.$isActive ? '#e7f5ff' : '#f8f9fa')};
  border: 2px solid ${(props) => (props.$isActive ? '#228be6' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;
