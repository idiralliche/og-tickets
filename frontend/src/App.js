import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import OlympicEventsPage from './pages/OlympicEventsPage';
import OffersPage from './pages/OffersPage.js';
import './styles.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/epreuves" element={<OlympicEventsPage />} />
        <Route path="/offres" element={<OffersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
