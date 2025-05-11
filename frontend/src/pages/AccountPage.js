import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from '../components/Login';
import Register from '../components/Register';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/LoadingSpinner.js';

const AccountPage = () => {
  const { accessToken, loading, logout } = useContext(AuthContext);
  // Tab state to switch between login and register
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (!accessToken) {
      setActiveTab('login');
    }
  }, [accessToken]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is authenticated, display "My Account"
  if (accessToken) {
    return (
      <Layout
        title='Mon compte'
        subtitle='Gérez vos informations personnelles'
        mainClassName='account-page'
      >
        <p>Pour le moment, cette page est vide.</p>

        <button
          className='button'
          style={{
            margin: '2rem auto 4rem',
            display: 'block',
            color: '#ffffff',
          }}
          onClick={logout}
        >
          Déconnexion
        </button>
      </Layout>
    );
  }

  // Otherwise, display the interface with both tabs (login & register)
  return (
    <Layout
      title='Connexion / Inscription'
      subtitle='Connectez-vous ou créez votre compte'
      mainClassName='account-page'
    >
      <div className='auth-container'>
        <div className='auth-tabs'>
          <button
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => setActiveTab('login')}
          >
            Se connecter
          </button>
          <button
            className={activeTab === 'register' ? 'active' : ''}
            onClick={() => setActiveTab('register')}
          >
            S'inscrire
          </button>
        </div>

        <div className='auth-content'>
          {activeTab === 'login' ? <Login /> : <Register />}
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
