import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MenuRanking from './pages/MenuRanking';
import LLMAnalysis from './pages/LLMAnalysis';
import WantedMenusPage from './pages/WantedMenusPage';
import FrequencyMenu from './pages/FrequencyMenu';
import LLMReportList from './pages/LLMReportList';
import LLMReportDetail from './pages/LLMReportDetail';
import CreateMenu from './pages/CreateMenu';

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
            <Route path="/team3/admin/llm-report-list" element={<LLMReportList />} />
            <Route path="/team3/admin/llm-report/:id" element={<LLMReportDetail />} />
            <Route path="/team3/admin/wanted-menus" element={<WantedMenusPage />} />
            <Route path="/team3/admin/frequency-menus" element={<FrequencyMenu />} />
            <Route path="/team3/admin/create-menu" element={<CreateMenu />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
