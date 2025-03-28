import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global/App.css';
import AjouterEnseignant from './pages/AjouterEnseignant';
import AjouterFiliere from './pages/AjouterFiliere';
import AjouterSalle from './pages/AjouterSalle';
import AjouterSection from './pages/AjouterSection';
import GénérateurExamen from './pages/GénérateurExamen';
import GénérerExamen from './pages/GénérerExamen';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Admin from './pages/Admin';

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
          <Route path="/GénérateurExamen" element={<GénérateurExamen />} />
          <Route path="/GénérerExamen" element={<GénérerExamen />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
