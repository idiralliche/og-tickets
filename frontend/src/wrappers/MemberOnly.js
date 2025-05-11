import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner.js';

/**
 * Restricts access to routes for **authenticated** ("members") only.
 * If the user is not authenticated, redirects them to the login page.
 */
const MemberOnly = ({ children, redirectTo = '/acces' }) => {
  const { accessToken, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is not logged in, redirect to `redirectTo`
  return accessToken ? children : <Navigate to={redirectTo} replace />;
};

export default MemberOnly;
