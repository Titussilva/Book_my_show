import React from 'react';

/**
 * Full-page loading spinner
 * @param {string} message - Optional message to display
 */
const Spinner = ({ message = 'Loading...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      {message && <p className="text-muted text-sm">{message}</p>}
    </div>
  );
};

export default Spinner;
