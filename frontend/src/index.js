import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { GuestCartProvider } from './context/GuestCartContext';
import { UserCartProvider } from './context/UserCartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <GuestCartProvider>
            <UserCartProvider>
              <App />
            </UserCartProvider>
          </GuestCartProvider>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
