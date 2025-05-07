import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MenuRanking from './pages/MenuRanking';
import LLMAnalysis from './pages/LLMAnalysis';
import WantedMenusPage from './pages/WantedMenusPage';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Layout>
          <Routes>
            <Route path="/team3/admin" element={<Dashboard />} />
            <Route path="/team3/admin/menu-ranking" element={<MenuRanking />} />
            <Route path="/team3/admin/llm-analysis" element={<LLMAnalysis />} />
            <Route path="/team3/admin/wanted-menus" element={<WantedMenusPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
