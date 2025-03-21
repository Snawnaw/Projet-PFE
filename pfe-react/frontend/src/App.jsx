import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global/App.css';
import AjouterEnseignant from './pages/AjouterEnseignant';
import AjouterFiliere from './pages/AjouterFiliere';
import AjouterSalle from './pages/AjouterSalle';
import AjouterSection from './pages/AjouterSection';
import Connexion from './pages/Connexion';
import SignIn from './pages/SignIn';
import Home from './pages/Home';

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
          <Route path="/Connexion" element={<Connexion />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
