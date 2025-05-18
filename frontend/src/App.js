import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import OlympicEventsPage from './pages/OlympicEventsPage';
import OffersPage from './pages/OffersPage.js';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage.js';
import ActivationPage from './pages/ActivationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage.js';
import ResetPasswordConfirmPage from './pages/ResetPasswordConfirmPage.js';
import UnauthenticatedOnly from './wrappers/UnauthenticatedOnly';
import MemberOnly from './wrappers/MemberOnly';
import './main.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/epreuves' element={<OlympicEventsPage />} />
        <Route path='/offres' element={<OffersPage />} />
        <Route path='/panier' element={<CartPage />} />
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
      </Routes>
    </Router>
  );
};

export default App;
