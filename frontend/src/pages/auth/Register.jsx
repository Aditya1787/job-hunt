import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheckSquare } from 'react-icons/fi';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useNotifications();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(searchParams.get('role') || 'candidate'); // candidate, company
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const registeredUser = await register(name, email, password, role);
      showToast(`Welcome, ${registeredUser.name}! Account created successfully.`, 'success');
      
      // Redirect based on role
      navigate(`/${role}/dashboard`);
    } catch (err) {
      showToast(String(err), 'error');
    } finally {
      setLoading(false);
    }
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
            Create Account
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Join CareerConnect and configure your professional path.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80">
          {['candidate', 'company'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
              }}
              className={`py-2.5 rounded-lg text-xs font-bold capitalize transition duration-200 ${
                role === r
                  ? 'bg-white dark:bg-slate-800 text-primary dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350'
              }`}
            >
              {r === 'company' ? 'Recruiter' : 'Candidate'}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-slate-450 dark:text-slate-400">
              Full Name
            </label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

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
                placeholder="e.g. john@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-slate-450 dark:text-slate-400">
              Password
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
                placeholder="Confirm password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/25 hover:shadow-primary/45 transition flex items-center justify-center gap-1.5"
          >
            {loading ? 'Creating Account...' : <><FiCheckSquare className="w-4 h-4" /> Register</>}
          </button>

        </form>

        {/* Toggle option */}
        <div className="text-center text-xs mt-6 text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-primary hover:text-primary-dark transition"
          >
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
