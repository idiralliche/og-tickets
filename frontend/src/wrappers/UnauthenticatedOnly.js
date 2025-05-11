import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner.js';

/**
 * Restricts access to routes for **unauthenticated** users only.
 * If the user is already authenticated, redirects them elsewhere.
 */
const UnauthenticatedOnly = ({ children, redirectTo = '/' }) => {
  const { accessToken, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is logged in, redirect to `redirectTo`
  return accessToken ? <Navigate to={redirectTo} replace /> : children;
};

export default UnauthenticatedOnly;
