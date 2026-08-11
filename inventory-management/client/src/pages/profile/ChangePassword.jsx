import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiKey, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { changePassword as changePasswordApi } from '../../services/authService';
import Button from '../../components/common/Button';

/**
 * Change Password page
 */
const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.currentPassword) errs.currentPassword = 'Current password is required';
    if (!formData.newPassword) errs.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6)
      errs.newPassword = 'New password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await changePasswordApi({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Password updated successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FiKey className="text-accent" /> Change Password
          </h1>
          <p className="page-subtitle">Update your secret password for account security</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="currentPassword">
              Current Password <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="currentPassword"
                name="currentPassword"
                type={showPass ? 'text' : 'password'}
                className={`form-input input-with-icon-right ${errors.currentPassword ? 'error' : ''}`}
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="input-icon input-icon-right"
                onClick={() => setShowPass((prev) => !prev)}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.currentPassword && <p className="form-error">{errors.currentPassword}</p>}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">
              New Password <span className="required">*</span>
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type={showPass ? 'text' : 'password'}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              placeholder="Minimum 6 characters"
              value={formData.newPassword}
              onChange={handleChange}
            />
            {errors.newPassword && <p className="form-error">{errors.newPassword}</p>}
          </div>

          {/* Confirm New Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm New Password <span className="required">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPass ? 'text' : 'password'}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              <FiCheckCircle /> Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
