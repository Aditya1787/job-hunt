import React, { useState } from 'react';
import api from '../../services/api.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiLock, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CompanySettings = () => {
  const { showToast } = useNotifications();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('All fields are required', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/auth/change-password', { oldPassword, newPassword });
      showToast(res.data.message || 'Password changed successfully', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen space-y-6">
      
      <div>
        <Link to="/company/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-655 dark:hover:text-white transition">
          <FiArrowLeft /> Back to Hub
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Recruiter Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your credentials and recruiter access keys.
        </p>
      </div>

      <form onSubmit={handleChangePassword} className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FiLock /> Change Password
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-slate-400">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              className="w-full px-3.5 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-slate-400">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-slate-400">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3.5 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md transition"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

    </div>
  );
};

export default CompanySettings;
