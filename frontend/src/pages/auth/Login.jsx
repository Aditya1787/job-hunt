import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiMail, FiLock, FiUser, FiArrowRight, FiZap } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useNotifications();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(searchParams.get('role') || 'candidate'); // candidate, company, admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password, role);
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');
      
      // Redirect based on role
      navigate(`/${role}/dashboard`);
    } catch (err) {
      showToast(String(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Demo Login Shortcuts
  const triggerDemoLogin = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'candidate') {
      setEmail('candidate@demo.com');
      setPassword('password123');
    } else if (demoRole === 'company') {
      setEmail('company@demo.com');
      setPassword('password123');
    } else if (demoRole === 'admin') {
      setEmail('admin@main.com');
      setPassword('password123');
    }
    showToast(`Credentials filled for demo ${demoRole}! Click Sign In.`, 'info');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-md w-full space-y-8 glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        
        {/* Branding header */}
        <div className="text-center">
          <span className="h-12 w-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-md">
            C
          </span>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Sign in to manage your CareerConnect applications & vacancies.
          </p>
        </div>

        {/* Role Toggles */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80">
          {['candidate', 'company', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setEmail('');
                setPassword('');
              }}
              className={`py-2 rounded-lg text-xs font-bold capitalize transition duration-200 ${
                role === r
                  ? 'bg-white dark:bg-slate-800 text-primary dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Input Form */}
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

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold uppercase text-slate-450 dark:text-slate-400">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-primary hover:text-primary-dark transition"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-500 dark:text-slate-400">
              Remember me
            </label>
          </div>

          {/* Action trigger */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/25 hover:shadow-primary/45 transition flex items-center justify-center gap-1.5"
          >
            {loading ? 'Authenticating...' : <><FiZap className="w-4 h-4" /> Sign In</>}
          </button>

        </form>

        {/* Demo shortcuts container */}
        <div className="border-t border-slate-150 dark:border-slate-850 pt-4 flex flex-col gap-2.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider text-center">
            Demo Login shortcuts (Seed data)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => triggerDemoLogin('candidate')}
              className="py-1.5 rounded-lg text-[10px] font-bold bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-light border border-primary/20 transition"
            >
              Candidate
            </button>
            <button
              onClick={() => triggerDemoLogin('company')}
              className="py-1.5 rounded-lg text-[10px] font-bold bg-accent/10 hover:bg-accent/20 text-accent dark:text-accent-light border border-accent/20 transition"
            >
              Recruiter
            </button>
            <button
              onClick={() => triggerDemoLogin('admin')}
              className="py-1.5 rounded-lg text-[10px] font-bold bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/20 transition"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Toggle option */}
        <div className="text-center text-xs mt-6 text-slate-500">
          Don't have an account?{' '}
          <Link
            to={`/register?role=${role}`}
            className="font-bold text-primary hover:text-primary-dark transition"
          >
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
