import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import ChatbotWidget from '../../pages/ChatbotWidget'; 

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        {children}
        <ChatbotWidget /> {/* ✅ 여기에 챗봇 위젯 추가 */}
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  position: relative; /* ✅ 챗봇 위치 기준을 위해 relative 설정 */
`;

export default Layout;
