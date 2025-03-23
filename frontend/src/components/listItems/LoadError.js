import React from 'react';

const LoadError = ({ itemsLabel }) => {
  return (
    <div className='error-container' data-testid='error'>
      <p className='error-message'>
        ⚠️ Les {itemsLabel}s n'ont pas pu être récupérées.
      </p>
    </div>
  );
};

export default LoadError;
