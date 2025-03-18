import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Layout />
    </BrowserRouter>
  );
}

export default App;
