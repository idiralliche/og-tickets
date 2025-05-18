import React from 'react';
import { TiWarning } from 'react-icons/ti';

const LoadError = ({ itemsLabel }) => {
  return (
    <div className='error-container' data-testid='error'>
      <p className='error-message'>
        <TiWarning /> Les {itemsLabel}s n'ont pas pu être récupérées.
      </p>
    </div>
  );
};

export default LoadError;
