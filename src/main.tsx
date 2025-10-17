import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { attachConsole, info } from '@tauri-apps/plugin-log';
import App from './App';
import '@/styles/themes.css';
import '@/styles/index.css';

// Initialize logging early in the application lifecycle
const initializeLogging = async () => {
  try {
    // This makes all console.log, console.error, etc., automatically get saved to the log file
    await attachConsole();
    info('Bubbly Quest frontend initialized');
    console.log('Logging system initialized - all console output will be saved to the log file');
  } catch (error) {
    console.error('Failed to initialize logging:', error);
  }
};

// Initialize logging before rendering the app
initializeLogging().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
});
