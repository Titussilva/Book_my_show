import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiPackage } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { login as loginApi } from '../../services/authService';
import Button from '../../components/common/Button';

/**
 * Login page — handles user authentication
 */
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email address';
    if (!formData.password) errs.password = 'Password is required';
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
      const res = await loginApi(formData);
      const userData = res.data.data;
      login(userData, userData.token);
      toast.success(`Welcome back, ${userData.name}!`);
      navigate(userData.role === 'admin' ? '/dashboard' : '/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <FiPackage className="auth-logo-icon" />
          <span className="auth-logo-text">InventoryPro</span>
        </div>

        <h1 className="auth-heading">Sign in to your account</h1>
        <p className="auth-subheading">Enter your credentials to access the system</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="admin@inventory.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input input-with-icon-right ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-icon input-icon-right"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
          >
            Sign In
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create one
          </Link>
        </p>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: '1.5rem', padding: '0.875rem', borderRadius: 'var(--radius)',
          backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)',
          fontSize: '0.8125rem', color: 'var(--text-secondary)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>
            Demo Credentials:
          </p>
          <p>🔑 Admin: <code>admin@inventory.com</code> / <code>Admin@123</code></p>
          <p style={{ marginTop: '0.25rem' }}>
            👤 Employee: <code>employee@inventory.com</code> / <code>Employee@123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
