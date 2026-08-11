import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiTag, FiTruck,
  FiPlusCircle, FiMinusCircle, FiList, FiUser, FiX
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

/**
 * Application sidebar with role-based navigation
 * @param {boolean} isOpen - Mobile open state
 * @param {function} toggleSidebar - Toggle handler
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  const menuItems = [
    ...(user?.role === 'admin' ? [
      { path: '/dashboard', name: 'Dashboard', icon: <FiGrid /> }
    ] : []),
    { path: '/products', name: 'Products', icon: <FiPackage /> },
    ...(user?.role === 'admin' ? [
      { path: '/categories', name: 'Categories', icon: <FiTag /> },
      { path: '/suppliers', name: 'Suppliers', icon: <FiTruck /> },
    ] : []),
    { path: '/inventory/stock-in', name: 'Stock In', icon: <FiPlusCircle /> },
    { path: '/inventory/stock-out', name: 'Stock Out', icon: <FiMinusCircle /> },
    { path: '/inventory/transactions', name: 'Transactions', icon: <FiList /> },
    { path: '/profile', name: 'Profile', icon: <FiUser /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <FiPackage className="sidebar-logo-icon" />
        <span className="sidebar-logo-text">InventoryPro</span>
        <button
          onClick={toggleSidebar}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: '#94a3b8', cursor: 'pointer', fontSize: '1.125rem',
            display: 'flex', alignItems: 'center',
          }}
          className="hamburger-btn"
          aria-label="Close sidebar"
        >
          <FiX />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name || 'User'}</p>
          <span className="role-badge">{user?.role || 'employee'}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
