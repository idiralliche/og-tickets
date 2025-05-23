/**
 * Helper function to get the ID from an item object or use the item itself if it's already an ID.
 * @param {Object|number} idSource - The item object or ID.
 * @returns {number} The ID of the item.
 */
export const extractId = (idSource) =>
  typeof idSource === 'object' && idSource !== null ? idSource.id : idSource;

/**
 * Formats a date string into a localized date and time string in French.
 * @function
 * @param {string} date_time - The date string to format.
 * @returns {string} The formatted date and time string in French.
 */
export const formatDate = (date_time) =>
  new Date(date_time).toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
