import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';

const Home = () => {
    return (
        <div className="home">
            <h1>Système de Gestion Universitaire</h1>
            <div className="navigation-buttons">
                <Link to="/AjouterEnseignant" className="btn btn-primary">Ajouter Enseignants</Link>
                <Link to="/AjouterSection" className="btn btn-primary">Ajouter Sections</Link>
                <Link to="/AjouterFiliere" className="btn btn-primary">Ajouter Filières</Link>
                <Link to="/AjouterSalle" className="btn btn-primary">Ajouter Salles</Link>
                <Link to="/SignIn" className="btn btn-primary">Sign in</Link>
                <Link to="/Connexion" className="btn btn-primary">Connexion</Link>
            </div>
        </div>
    );
};

export default Home;
