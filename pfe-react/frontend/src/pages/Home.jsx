import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';


//Basicly so for implementing components
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="home">
            <Navbar />
            <h1>Système de generation d'examen </h1>
            <div className="navigation-buttons">
                <Link to="/SignIn" className="btn btn-primary">Se connecter</Link>
                <Link to="/SignUp" className="btn btn-primary">Créer un compte</Link>
                <Link to="/GénérateurExamen" className="btn btn-primary">Générateur d'examen</Link>
                <Link to="/GénérerExamen" className="btn btn-primary">Générer Examen</Link>
                <Link to="/Admin" className="btn btn-primary">Admin</Link>
                <Link to="/User" className="btn btn-primary">User</Link>
            </div>
        </div>
    );
};

export default Home;
