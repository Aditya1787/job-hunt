import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';

const ForgotPassword = () => {
  const { showToast } = useNotifications();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      showToast(res.data.message || 'Reset link generated!', 'success');
      setSuccess(true);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to submit request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition mb-4">
            <FiArrowLeft /> Back to Sign In
          </Link>
          
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Provide your registered email and we will simulate a password recovery link.
          </p>
        </div>

        {!success ? (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase text-slate-450 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. candidate@demo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/25 transition flex items-center justify-center gap-1.5"
            >
              {loading ? 'Sending link...' : <><FiSend className="w-4 h-4" /> Generate Reset Link</>}
            </button>
          </form>
        ) : (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Mock Email Dispatched!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              For security and simplicity, we have generated your reset token and output the reset URL inside the <strong>backend terminal/server logs</strong>. Please copy that URL and paste it in your browser address bar.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
