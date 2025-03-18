import { ReactNode } from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
`;

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <LayoutContainer>{children}</LayoutContainer>;
};
