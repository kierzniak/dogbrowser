/**
 * Convert timestamp to date.
 *
 * @param {string} timestamp - Timestamp to convert.
 *
 * @returns {string} Converted date.
 */
export default function(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString();
}
