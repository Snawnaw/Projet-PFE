import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LayoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
`;

export const Layout = ({ children }) => {
    return <LayoutContainer>{children}</LayoutContainer>;
};

Layout.propTypes = {
    children: PropTypes.node.isRequired
};
