import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n'; // i18n yapılandırma dosyanızı import edin

// Suppress React DevTools warning in development
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('Download the React DevTools')) {
      return;
    }
    originalError.apply(console, args);
  };
}

// Suppress runtime.lastError warnings (usually from Chrome extensions)
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('runtime.lastError')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);