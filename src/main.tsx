import React from 'react';
import { createRoot } from 'react-dom/client';
import { StudioProvider } from './studio';
import { ControlPage } from './Control';
import './styles.css';
import './styles/overlay.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root is missing from index.html.');

createRoot(root).render(
  <React.StrictMode>
    <StudioProvider>
      <ControlPage />
    </StudioProvider>
  </React.StrictMode>,
);
