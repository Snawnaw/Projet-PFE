import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AjouterEnseignant from './pages/AjouterEnseignant';
import GénérateurExamen from './pages/GénérateurExamen';
import AjouterSection from './pages/AjouterSection';
import AjouterFiliere from './pages/AjouterFiliere';
import AjouterModule from './pages/AjouterModule';
import AjouterSalle from './pages/AjouterSalle';
import CreerQuestion from './pages/CreerQuestion';
import BanqueDeQuestions from './pages/BanqueDeQuestions';
import Sections from './pages/Sections';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Admin from './pages/Admin';
import './styles/global/App.css';
import Home from './pages/Home';
import User from './pages/User';
import React from 'react';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AjouterEnseignant" element={<AjouterEnseignant />} />
          <Route path="/AjouterFiliere" element={<AjouterFiliere />} />
          <Route path="/AjouterSalle" element={<AjouterSalle />} />
          <Route path="/AjouterSection" element={<AjouterSection />} />
          <Route path="/AjouterModule" element={<AjouterModule />} />
          <Route path="/GénérateurExamen" element={<GénérateurExamen />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Sections" element={<Sections />} />
          <Route path="User" element={<User />} />
          <Route path="/CreerQuestion" element={<CreerQuestion />} />
          <Route path="/BanqueDeQuestions" element={<BanqueDeQuestions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
