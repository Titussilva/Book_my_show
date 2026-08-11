import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiBell, FiLogOut, FiUser, FiKey } from 'react-icons/fi';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

/**
 * Top navigation bar with theme toggle, user dropdown, and mobile hamburger
 */
const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="navbar">
      {/* Left: hamburger */}
      <div className="navbar-left">
        <button
          className="navbar-icon-btn hamburger-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Right: actions */}
      <div className="navbar-right">
        {/* Theme Toggle */}
        <button
          className="navbar-icon-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Notification Bell */}
        <button className="navbar-icon-btn" aria-label="Notifications" title="Notifications">
          <FiBell size={18} />
          <span className="notification-dot" />
        </button>

        {/* User Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            className="user-avatar"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="User menu"
            style={{ cursor: 'pointer', width: '34px', height: '34px', fontSize: '0.8rem' }}
          >
            {user?.name?.charAt(0) || 'U'}
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <div style={{ padding: '0.625rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  {user?.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {user?.email}
                </p>
              </div>
              <button
                className="dropdown-item"
                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
              >
                <FiUser size={15} /> Profile
              </button>
              <button
                className="dropdown-item"
                onClick={() => { setDropdownOpen(false); navigate('/change-password'); }}
              >
                <FiKey size={15} /> Change Password
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />
              <button className="dropdown-item danger" onClick={handleLogout}>
                <FiLogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
