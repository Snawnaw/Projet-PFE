import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import GlobalStyles from './styles/GlobalStyles';
import AjouterEnseignant from './components/AjouterEnseignant';
import AjouterFiliere from './components/AjouterFiliere';
import AjouterSection from './components/AjouterSection';
import NavigationHub from './components/NavigationHub';

const App: FC = () => {
  return (
    <Layout>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<NavigationHub />} />
        <Route path="/enseignants" element={<AjouterEnseignant />} />
        <Route path="/filieres" element={<AjouterFiliere />} />
        <Route path="/sections" element={<AjouterSection />} />
        <Route path="*" element={<NavigationHub />} /> {/* Add catch-all route */}
      </Routes>
    </Layout>
  );
}

export default App;
