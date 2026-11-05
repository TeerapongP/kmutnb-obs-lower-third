import React from 'react';
import { createRoot } from 'react-dom/client';
import { StudioProvider } from './studio';
import { ControlPage } from './Control';
import { OBSOverlayPage } from './OBSOverlayPage';
import './styles.css';
import './styles/overlay.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root is missing from index.html.');

createRoot(root).render(
  <React.StrictMode>
    {window.location.pathname === '/overlay' ? (
      <OBSOverlayPage />
    ) : (
      <StudioProvider>
        <ControlPage />
      </StudioProvider>
    )}
  </React.StrictMode>,
);
