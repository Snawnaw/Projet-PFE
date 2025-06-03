import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Section Hero */}
      <header className="hero-section">
        <nav className="navbar">
          <div className="logo">ExamGenius</div>
          <div className="auth-buttons">
            <Link to="/SignIn" className="btn btn-outline">Se connecter</Link>
            <Link to="/SignUp" className="btn btn-primary">S'inscrire</Link>
          </div>
        </nav>
        
        <div className="hero-content">
          <h1>Générez des examens parfaits en quelques minutes</h1>
          <p className="subtitle">
            Accédez à notre banque mondiale de questions pour créer des tests personnalisés pour toute matière et tout niveau.
            Utilisé par des éducateurs et étudiants du monde entier.
          </p>
        </div>
      </header>

      {/* Section Fonctionnalités */}
      <section className="features-section">
        <h2>Pourquoi les éducateurs adorent ExamGenius</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Banque mondiale de questions</h3>
            <p>Accédez à des milliers de questions dans toutes les matières, contribuées par des éducateurs du monde entier.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Génération intelligente</h3>
            <p>Des algorithmes alimentés par l'IA créent des examens équilibrés basés sur vos critères en quelques secondes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👩‍🏫</div>
            <h3>Plateforme collaborative</h3>
            <p>Partagez des questions avec vos collègues ou créez des examens ensemble en temps réel.</p>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="testimonials-section">
        <h2>Approuvé par des éducateurs du monde entier</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"ExamGenius a réduit mon temps de préparation d'examens de 80%. La banque de questions est incroyable !"</p>
            <div className="author">- Sarah K.</div>
          </div>
          <div className="testimonial-card">
            <p>"Les fonctionnalités collaboratives facilitent le travail avec mon département sur les examens communs."</p>
            <div className="author">- Elena P.</div>
          </div>
        </div>
      </section>

      {/* Appel à l'action final */}
      <section className="final-cta">
        <h2>Prêt à transformer votre création d'examens ?</h2>
        <p>Rejoignez des milliers d'éducateurs qui économisent du temps tout en créant de meilleures évaluations.</p>
      </section>

      {/* Pied de page */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-logo">ExamGenius</div>
          <div className="footer-links">
            <Link to="/about">À propos</Link>
            <Link to="/pricing">Tarifs</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Politique de confidentialité</Link>
          </div>
          <div className="footer-social">
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} ExamGenius.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;