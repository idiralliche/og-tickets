import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import OlympicEventsPage from './pages/OlympicEventsPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import AccountPage from './pages/AccountPage';
import ActivationPage from './pages/ActivationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordConfirmPage from './pages/ResetPasswordConfirmPage';
import UnauthenticatedOnly from './wrappers/UnauthenticatedOnly';
import MemberOnly from './wrappers/MemberOnly';
import { useCartSyncOnLogin } from './hooks/useCartSyncOnLogin';
import './main.css';

const App = () => {
  useCartSyncOnLogin();
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/panier' element={<CartPage />} />
      <Route path='/epreuves' element={<OlympicEventsPage />} />
      <Route
        path='/acces/ouverture'
        element={
          <UnauthenticatedOnly redirectTo='/'>
            <ActivationPage />
          </UnauthenticatedOnly>
        }
      />
      <Route
        path='/acces/break'
        element={
          <UnauthenticatedOnly redirectTo='/'>
            <ForgotPasswordPage />
          </UnauthenticatedOnly>
        }
      />
      <Route
        path='/acces/reprise'
        element={
          <UnauthenticatedOnly redirectTo='/'>
            <ResetPasswordConfirmPage />
          </UnauthenticatedOnly>
        }
      />
      <Route
        path='/loge'
        element={
          <MemberOnly redirectTo='/acces'>
            <AccountPage />
          </MemberOnly>
        }
      />
      <Route
        path='/acces'
        element={
          <UnauthenticatedOnly redirectTo='/'>
            <AccountPage />
          </UnauthenticatedOnly>
        }
      />
      <Route
        path='/finale'
        element={
          <MemberOnly redirectTo='/acces'>
            <OrderPage />
          </MemberOnly>
        }
      />
    </Routes>
  );
};

export default App;
