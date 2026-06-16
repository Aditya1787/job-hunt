import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiSliders, FiGlobe, FiMapPin, FiBriefcase, FiCheck, FiX, FiSlash, FiArrowLeft } from 'react-icons/fi';

const AdminCompanies = () => {
  const { showToast } = useNotifications();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/companies?status=${status}&search=${search}`);
      setCompanies(res.data || []);
    } catch (err) {
      console.error('Error fetching companies:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [status, search]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/admin/companies/${id}/status`, { status: newStatus });
      showToast(res.data.message || 'Status updated', 'success');
      fetchCompanies();
    } catch (err) {
      showToast(err.response?.data?.message || 'Status update failed', 'error');
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-6">
      
      <div>
        <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-655 dark:hover:text-white transition">
          <FiArrowLeft /> Back to Console
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Recruiter Company Reviews</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Verify recruiter corporate credentials and toggle active status levels.
        </p>
      </div>

      {/* Filters bar */}
      <div className="glass p-4 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-30">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company name..."
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg bg-transparent text-xs focus:outline-none focus:border-primary"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg bg-transparent text-xs focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending Verification</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(x => <div key={x} className="h-28 rounded-2xl glass shimmer"></div>)}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 glass border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-sm font-medium">
          No company records match your search.
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((comp) => (
            <div
              key={comp._id}
              className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={comp.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                  alt={comp.companyName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-850"
                />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">{comp.companyName}</h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-455 mt-1 font-semibold">
                    <span className="flex items-center gap-0.5">
                      <FiGlobe /> <a href={comp.website} target="_blank" rel="noreferrer" className="underline">{comp.website || 'No website'}</a>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-0.5">
                      <FiMapPin /> {comp.headquarters || 'No location'}
                    </span>
                    <span>&bull;</span>
                    <span>Industry: {comp.industry}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 line-clamp-1">{comp.description}</p>
                </div>
              </div>

              {/* Status & actions controls */}
              <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-slate-100 dark:border-slate-850 pt-3 sm:pt-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                  comp.verificationStatus === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : comp.verificationStatus === 'pending'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                }`}>
                  {comp.verificationStatus}
                </span>

                <div className="flex gap-1.5">
                  {comp.verificationStatus !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(comp._id, 'approved')}
                      className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition"
                      title="Verify Company"
                    >
                      <FiCheck className="w-4 h-4" />
                    </button>
                  )}
                  {comp.verificationStatus !== 'rejected' && comp.verificationStatus === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(comp._id, 'rejected')}
                      className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition"
                      title="Reject verification"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                  {comp.verificationStatus === 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(comp._id, 'suspended')}
                      className="p-1.5 rounded bg-slate-500/10 hover:bg-slate-500/20 text-slate-500 transition"
                      title="Suspend company"
                    >
                      <FiSlash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminCompanies;
