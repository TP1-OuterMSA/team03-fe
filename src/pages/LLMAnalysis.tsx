import React from 'react';
import styled from 'styled-components';

const LLMAnalysis = () => {
  return (
    <LLMAnalysisContainer>
      <h1>LLM 분석</h1>
    </LLMAnalysisContainer>
  );
};

const LLMAnalysisContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

export default LLMAnalysis;
