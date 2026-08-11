import React from 'react';

/**
 * Badge component for status display
 * @param {string} variant - success | warning | danger | info | default | indigo
 */
const Badge = ({ variant = 'default', children }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
};

export default Badge;
