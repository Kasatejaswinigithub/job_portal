import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mock Sentry Integration for real-time error monitoring
const initSentry = () => {
  console.log('[Sentry] Initialized. Monitoring for errors...');
  // In a real app: Sentry.init({ dsn: "..." });
  window.addEventListener('error', (event) => {
    console.error('[Sentry] Captured Exception:', event.error);
  });
};

initSentry();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
