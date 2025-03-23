import React from 'react';

const UnavailableData = ({ message, itemsClassName }) => {
  return (
    <p
      data-testid={`no-${itemsClassName}`}
      className={`no-${itemsClassName} info-message`}
    >
      {message}
    </p>
  );
};

export default UnavailableData;
