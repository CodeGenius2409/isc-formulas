import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/besley/wght.css';
import '@fontsource-variable/atkinson-hyperlegible-next/wght.css';
import '@fontsource-variable/atkinson-hyperlegible-mono/wght.css';
import './styles/app.css';
import './state/prefs';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
