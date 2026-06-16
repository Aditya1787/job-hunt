import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiAlertTriangle, FiCheckCircle, FiUser, FiBriefcase, FiClock, FiArrowLeft } from 'react-icons/fi';

const AdminReports = () => {
  const { showToast } = useNotifications();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reports');
      setReports(res.data || []);
    } catch (err) {
      console.error('Error fetching reports:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id) => {
    try {
      const res = await api.put(`/admin/reports/${id}/resolve`);
      showToast(res.data.message || 'Report marked as resolved', 'success');
      fetchReports();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
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
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-500">Spam & Complaints Center</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review spam listings, fake profile alerts, and candidate safety complaints.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(x => <div key={x} className="h-28 glass shimmer"></div>)}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 glass border border-slate-205 dark:border-slate-800 rounded-3xl text-slate-450 text-sm font-medium">
          No reports logs exist. Safe job listings verified!
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep._id}
              className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <FiAlertTriangle className="text-rose-500" />
                  <span className="font-extrabold capitalize text-sm">{rep.type.replace('_', ' ')}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                    rep.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-455 font-semibold">
                  <span className="flex items-center gap-0.5"><FiUser /> Reported By: {rep.reportedBy?.name}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-0.5"><FiBriefcase /> Target Job: {rep.job?.title || 'Deleted Posting'}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  Complaint Details: {rep.description}
                </p>
              </div>

              {/* Action trigger */}
              {rep.status === 'pending' && (
                <button
                  onClick={() => handleResolve(rep._id)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1 self-stretch md:self-auto"
                >
                  <FiCheckCircle /> Resolve Report
                </button>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminReports;
