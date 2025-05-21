import React, { useState } from 'react';
import NavLinks from './NavLinks';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>
          <img
            src={`${process.env.PUBLIC_URL}/og-tickets-w.svg`}
            alt='og-tickets logo'
          />
        </Link>
      </div>

      <nav>
        <NavLinks />

        <div className='burger-menu' onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <div
          className={`mobile-nav ${menuOpen ? 'open' : ''}`}
          onClick={closeMenu}
        >
          <NavLinks onLinkClick={toggleMenu} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
