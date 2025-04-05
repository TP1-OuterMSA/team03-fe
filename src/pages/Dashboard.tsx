import React from 'react';
import styled from 'styled-components';

const Dashboard = () => {
  return (
    <DashboardContainer>
      <h1>대시보드</h1>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

export default Dashboard;
