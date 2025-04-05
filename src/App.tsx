import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MenuRanking from './pages/MenuRanking';
import LLMAnalysis from './pages/LLMAnalysis';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Layout>
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/menu-ranking" element={<MenuRanking />} />
            <Route path="/admin/llm-analysis" element={<LLMAnalysis />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
