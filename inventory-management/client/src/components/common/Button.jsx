import React from 'react';

/**
 * Reusable Button Component
 * @param {string} variant - primary | secondary | danger | success | outline | ghost
 * @param {string} size - sm | md | lg
 * @param {boolean} loading - Shows spinner if true
 * @param {boolean} disabled
 * @param {function} onClick
 * @param {string} type
 * @param {string} className - Extra classes
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  type = 'button',
  className = '',
}) => {
  const baseClass = `btn btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  return (
    <button
      type={type}
      className={`${baseClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="btn-spinner" />}
      {children}
    </button>
  );
};

export default Button;
