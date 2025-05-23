import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaShoppingBag, FaChild } from 'react-icons/fa';

const NavLinks = ({ onLinkClick }) => {
  const { accessToken } = useContext(AuthContext);

  return (
    <>
      <ul className='nav-links'>
        <li>
          <Link
            data-testid='nav-link-events'
            to='/epreuves'
            onClick={onLinkClick}
          >
            Les épreuves
          </Link>
        </li>
      </ul>
      <ul className='nav-links'>
        <li>
          <Link
            data-testid='nav-link-cart'
            to='/panier'
            onClick={onLinkClick}
            className='iconlink'
          >
            <span className='nav-link-icon cart'>
              <FaShoppingBag />
            </span>
            <span className='nav-link-text'>Panier</span>
          </Link>
        </li>
        <li>
          {accessToken ? (
            <Link
              data-testid='nav-link-account'
              to='/loge'
              onClick={onLinkClick}
              className='iconlink'
            >
              <span className='nav-link-icon user'>
                <FaChild />
              </span>
              <span className='nav-link-text'>Mon compte</span>
            </Link>
          ) : (
            <Link
              data-testid='nav-link-login'
              to='/acces'
              onClick={onLinkClick}
              className='iconlink'
            >
              <span className='nav-link-icon user'>
                <FaChild />
              </span>
              <span className='nav-link-text'>Connexion</span>
            </Link>
          )}
        </li>
      </ul>
    </>
  );
};

export default NavLinks;
