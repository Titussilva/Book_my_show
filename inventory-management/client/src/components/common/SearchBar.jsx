import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * Debounced search bar component
 * @param {string} value
 * @param {function} onChange - Called after 400ms debounce
 * @param {string} placeholder
 */
const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  const [term, setTerm] = useState(value || '');

  useEffect(() => {
    setTerm(value || '');
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (term !== value) onChange(term);
    }, 400);
    return () => clearTimeout(timer);
  }, [term]);

  return (
    <div className="search-wrapper">
      <FiSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  );
};

export default SearchBar;
