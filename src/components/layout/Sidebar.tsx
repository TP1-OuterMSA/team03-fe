import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

// icon
import dashboardIcon from '../../assets/images/sidebar/dashboard.png';
import llmAnalysisIcon from '../../assets/images/sidebar/llm-anaylsis.png';
import menuRankingIcon from '../../assets/images/sidebar/menu-ranking.png';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: '대시보드', icon: dashboardIcon },
    { path: '/admin/llm-analysis', label: 'LLM 분석', icon: llmAnalysisIcon },
    { path: '/admin/menu-ranking', label: '메뉴 랭킹', icon: menuRankingIcon },
  ];

  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoLink to="/admin">
          <Logo>학식</Logo>
        </LogoLink>
      </LogoContainer>
      <Nav>
        {menuItems.map((item) => (
          <NavItem key={item.label} to={item.path} $isActive={location.pathname === item.path}>
            <IconWrapper>
              <img src={item.icon} alt={item.label} />
            </IconWrapper>
            {item.label}
          </NavItem>
        ))}
      </Nav>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.aside`
  width: 240px;
  background-color: #fff;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
`;

const LogoContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;

const Logo = styled.h1`
  font-family: ${({ theme }) => theme.typography.fonts.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const NavItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.text.primary};
  background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.hover : 'transparent')};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

export default Sidebar;
