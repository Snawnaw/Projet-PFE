import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 2rem;
  
  h1 {
    margin-bottom: 1rem;
  }
`;

const NotFound = () => {
    return (
        <NotFoundContainer>
            <h1>404 - Page Non Trouvée</h1>
            <Link to="/" className="btn btn-primary">
                Retour à l'accueil
            </Link>
        </NotFoundContainer>
    );
};

export default NotFound;
