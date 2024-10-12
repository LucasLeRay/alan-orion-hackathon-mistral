import { Toaster } from 'sonner';
import { HomePage } from './pages/HomePage';
import { CssBaseline, CssVarsProvider } from '@mui/joy';

function App() {
  return (
    <>
      <Toaster richColors duration={1000} />
      <CssVarsProvider>
        <CssBaseline />
        <HomePage />
      </CssVarsProvider>
    </>
  );
}

export default App;
