import React from 'react';

const LoadingSpinner = ({ loadingTarget = '' }) => {
  return (
    <div className='spinner-container' data-testid='loading'>
      <div className='spinner'></div>
      <p className='loading-text info-message'>Chargement {loadingTarget}...</p>
    </div>
  );
};

export default LoadingSpinner;
