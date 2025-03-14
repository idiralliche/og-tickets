import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import OlympicEventsPage from './pages/OlympicEventsPage';
import OffersPage from './pages/OffersPage.js';
import CartPage from './pages/CartPage';
import './main.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/epreuves' element={<OlympicEventsPage />} />
        <Route path='/offres' element={<OffersPage />} />
        <Route path='/panier' element={<CartPage />} />
      </Routes>
    </Router>
  );
};

export default App;
