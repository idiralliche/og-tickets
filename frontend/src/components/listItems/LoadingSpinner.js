import React from 'react';

const LoadingSpinner = ({ itemsLabel }) => {
  return (
    <div className='spinner-container' data-testid='loading'>
      <div className='spinner'></div>
      <p className='loading-text info-message'>
        Chargement des {itemsLabel}s...
      </p>
    </div>
  );
};

export default LoadingSpinner;
