import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/besley/wght.css';
import '@fontsource-variable/atkinson-hyperlegible-next/wght.css';
import '@fontsource-variable/atkinson-hyperlegible-mono/wght.css';
import './styles/app.css';
import './state/prefs';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary label="The book">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Nothing the first screen needs waits on these.
const whenIdle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 400));
whenIdle(() => {
  void import('./lib/page-transition');
  void import('./lib/controls-motion');
  void import('./components/FindPalette');
});
