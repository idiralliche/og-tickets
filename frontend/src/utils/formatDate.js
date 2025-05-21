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
