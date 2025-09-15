import React from 'react';
import ReactDOM from 'react-dom/client';
import NavigationTestPage from './pages/NavigationTestPage';
import { AuthProvider } from './components/navigation_screens';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <NavigationTestPage />
    </AuthProvider>
  </React.StrictMode>,
);
