import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiLock, FiCheckCircle } from 'react-icons/fi';

const ResetPassword = () => {
  const { token } = useParams();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      showToast('Password reset successful!', 'success');
      setSuccess(true);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Set New Password
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Create a secure, fresh password for your CareerConnect profile.
          </p>
        </div>

        {!success ? (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-450 dark:text-slate-400">
                New Password
              </label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-450 dark:text-slate-400">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/25 transition flex items-center justify-center gap-1.5"
            >
              {loading ? 'Updating password...' : 'Update Password'}
            </button>

          </form>
        ) : (
          <div className="mt-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <FiCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">Password Updated!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Your password has been changed successfully. You can now use your new credentials to sign in.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition"
            >
              Go to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
