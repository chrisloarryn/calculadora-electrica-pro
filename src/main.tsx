import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { App } from './app/App';
import { theme } from './app/theme';
import './styles/index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('No se encontró el elemento raíz de la aplicación.');
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
