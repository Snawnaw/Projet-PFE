import React from 'react';
import { useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

const NavigationButtons = () => {
    const navigate = useNavigate();

    const pages = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        // Add more pages as needed
    ];

    return (
        <div className="navigation-container" style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
            {pages.map((page, index) => (
                <button
                    key={index}
                    className="nav-button"
                    onClick={() => navigate(page.path)}
                >
                    {page.name}
                </button>
            ))}
        </div>
    );
};

export default NavigationButtons;