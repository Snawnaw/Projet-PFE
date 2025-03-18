import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #1A4B84;
    --secondary-color: #F5F7FA;
    --success-color: #2ECC71;
    --danger-color: #E74C3C;
    // ...existing CSS variables...
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  // ...rest of existing CSS converted to styled-components...
`;
