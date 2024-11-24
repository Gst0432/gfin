import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Add version check and cache busting
const APP_VERSION = '1.0.0';
const lastVersion = localStorage.getItem('app_version');

if (lastVersion !== APP_VERSION) {
  // Clear cache and reload if version mismatch
  localStorage.clear();
  localStorage.setItem('app_version', APP_VERSION);
  
  // Clear cache storage
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}