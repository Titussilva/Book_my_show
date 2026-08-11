import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiShield, FiKey, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

/**
 * User Profile view page
 */
const Profile = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">View and manage your account info</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="profile-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.name}</h2>
            <div style={{ marginTop: '0.25rem' }}>
              <Badge variant={user?.role === 'admin' ? 'indigo' : 'info'}>
                {user?.role?.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: 'grid', gap: '1rem', margin: '1rem 0' }}>
          <div className="flex items-center gap-3">
            <FiUser className="text-accent" size={18} />
            <div>
              <p className="stat-label">Full Name</p>
              <p style={{ fontWeight: 600 }}>{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiMail className="text-accent" size={18} />
            <div>
              <p className="stat-label">Email Address</p>
              <p style={{ fontWeight: 600 }}>{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiShield className="text-accent" size={18} />
            <div>
              <p className="stat-label">Role & Permissions</p>
              <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {user?.role} {user?.role === 'admin' ? '(Full System Access)' : '(Standard Staff Access)'}
              </p>
            </div>
          </div>

          {user?.createdAt && (
            <div className="flex items-center gap-3">
              <FiCalendar className="text-accent" size={18} />
              <div>
                <p className="stat-label">Member Since</p>
                <p style={{ fontWeight: 600 }}>{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="divider" />

        <div className="flex justify-end mt-4">
          <Link to="/change-password">
            <Button variant="outline">
              <FiKey /> Change Password
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
