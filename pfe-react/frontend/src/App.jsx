import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import AjouterEnseignant from './pages/AjouterEnseignant';
import AjouterEtudiant from './pages/AjouterEtudiant';
import GénérateurExamen from './pages/GénérateurExamen';
import AjouterSection from './pages/AjouterSection';
import AjouterFiliere from './pages/AjouterFiliere';
import AjouterModule from './pages/AjouterModule';
import AjouterSalle from './pages/AjouterSalle';
import CreerQuestion from './pages/CreerQuestion';
import BanqueDeQuestions from './pages/BanqueDeQuestions';
import SubmissionTable from './pages/SubmissionTable';
import SubmissionView from './pages/SubmissionView';
import Sections from './pages/Sections';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Etudiant from './pages/Etudiant';
import Admin from './pages/Admin';
import './styles/global/App.css';
import Home from './pages/Home';
import User from './pages/User';
import ExamWeb from "./pages/ExamWeb";
import Examens from './pages/Examens';
import React from 'react';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div>
      {/*<ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
      toast.success('Ajout avec succes', 
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      );*/}
    <Router>
      <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/AjouterEnseignant" element={<AjouterEnseignant />} />
            <Route path="/AjouterEtudiant" element={<AjouterEtudiant />} />
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
            <Route path="/Etudiant" element={<Etudiant />} />
            <Route path="User" element={<User />} />
            <Route path="/CreerQuestion" element={<CreerQuestion />} />
            <Route path="/BanqueDeQuestions" element={<BanqueDeQuestions />} />
            <Route path="/generate-exam" element={<GénérateurExamen />} />
            <Route path="/submissions/:submissionId" element={<SubmissionView />} />
            <Route path="/exam/:shareableId" element={<ExamWeb />} />
            <Route path="/Examens" element={<Examens />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
