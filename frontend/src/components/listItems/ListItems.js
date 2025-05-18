import React from 'react';
import LoadError from './LoadError.js';
import LoadingSpinner from '../LoadingSpinner.js';
import UnavailableData from './UnavailableData.js';

/**
 * A reusable component for displaying lists with loading, error, and empty states.
 * Provides consistent UI patterns for data fetching scenarios.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} [props.items=[]] - The array of items to be displayed
 * @param {string} props.itemsLabel - The label describing the items (singular form)
 * @param {string} [props.itemsClassName] - Optional CSS class for styling the unavailable message
 * @param {boolean} props.loading - Loading state flag
 * @param {boolean} props.error - Error state flag
 * @param {React.ReactNode} props.children - The actual list content to render when data is available
 * @returns {JSX.Element} Conditional rendering of loading, error, empty states, or children
 *
 * @example
 * <ListItems
 *   items={users}
 *   itemsLabel="utilisateur"
 *   loading={isLoading}
 *   error={hasError}
 * >
 *   {users.map(user => <UserCard key={user.id} user={user} />)}
 * </ListItems>
 *
 * @description
 * This component handles three special states:
 * 1. Loading state - shows a spinner with French text
 * 2. Error state - shows an error message
 * 3. Empty state - shows "No items available" in French
 * Only renders children when data is available (not loading, no error, and items exist)
 */
const ListItems = ({
  items = [],
  itemsLabel,
  itemsClassName,
  loading,
  error,
  children,
}) => {
  const list = Array.isArray(items) ? items : [];
  return (
    <>
      {loading && <LoadingSpinner loadingTarget={`des ${itemsLabel}s`} />}
      {error && <LoadError itemsLabel={itemsLabel} />}
      {list.length === 0 && (
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
