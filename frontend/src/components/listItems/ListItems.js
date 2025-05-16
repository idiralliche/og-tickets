import React from 'react';
import LoadError from './LoadError.js';
import LoadingSpinner from '../LoadingSpinner.js';
import UnavailableData from './UnavailableData.js';

const ListItems = ({
  items,
  itemsLabel,
  itemsClassName,
  loading,
  error,
  children,
}) => {
  return (
    <>
      {loading && <LoadingSpinner loadingTarget={`des ${itemsLabel}s`} />}
      {error && <LoadError itemsLabel={itemsLabel} />}
      {items.length === 0 && (
        <UnavailableData
          message={`Aucune ${itemsLabel} disponible.`}
          itemsClassName={itemsClassName}
        />
      )}
      {children}
    </>
  );
};

export default ListItems;
