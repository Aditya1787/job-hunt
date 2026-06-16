import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiBriefcase, FiXCircle, FiPlay, FiTrash2, FiClock, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

const ManageJobs = () => {
  const { showToast } = useNotifications();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/companies/jobs');
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCloseJob = async (id) => {
    if (!window.confirm('Are you sure you want to close this job? Candidates will no longer be able to apply.')) return;
    try {
      await api.put(`/companies/jobs/${id}/close`);
      showToast('Job posting closed successfully', 'success');
      fetchJobs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleReopenJob = async (id) => {
    try {
      await api.put(`/companies/jobs/${id}/reopen`);
      showToast('Job reopened and sent for admin verification', 'success');
      fetchJobs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this job? All applications will also be deleted.')) return;
    try {
      await api.delete(`/companies/jobs/${id}`);
      showToast('Job listing and applications deleted', 'success');
      fetchJobs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-6">
      
      <div>
        <Link to="/company/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-655 dark:hover:text-white transition">
          <FiArrowLeft /> Back to Hub
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Manage Job Vacancies</h1>
        <p className="text-xs sm:text-sm text-slate-455 mt-1">
          Review listing approvals, edit details, close active openings, or remove posts.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(s => <div key={s} className="h-24 rounded-2xl glass shimmer"></div>)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 glass border border-slate-205 dark:border-slate-800 rounded-3xl text-slate-400">
          <FiBriefcase className="w-12 h-12 mx-auto mb-4" />
          <p className="font-semibold text-sm">No jobs posted yet.</p>
          <Link to="/company/post-job" className="text-xs text-primary font-bold hover:underline mt-2 block">
            Post your first vacancy opening &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">{job.title}</h3>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-450 mt-1 font-semibold">
                  <span>Category: {job.jobCategory}</span>
                  <span>&bull;</span>
                  <span>Location: {job.location} ({job.remoteType})</span>
                  <span>&bull;</span>
                  <span>Salary: ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</span>
                </div>
                
                {job.status === 'rejected' && job.rejectionReason && (
                  <p className="text-[10px] text-rose-500 font-medium mt-2 flex items-center gap-1 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
                    <FiAlertCircle className="flex-shrink-0" /> Rejected Reason: {job.rejectionReason}
                  </p>
                )}
              </div>

              {/* Status & actions controls */}
              <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between border-t sm:border-t-0 border-slate-100 dark:border-slate-850 pt-3 sm:pt-0">
                <div className="text-right sm:pr-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                    job.status === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : job.status === 'pending'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : job.status === 'closed'
                      ? 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  {job.status === 'approved' && (
                    <button
                      onClick={() => handleCloseJob(job._id)}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-450 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                      title="Close Job"
                    >
                      <FiXCircle className="w-4 h-4" />
                    </button>
                  )}
                  {job.status === 'closed' && (
                    <button
                      onClick={() => handleReopenJob(job._id)}
                      className="p-2 rounded-lg border border-slate-205 dark:border-slate-800 text-emerald-500 hover:bg-emerald-500/5 transition"
                      title="Reopen Job"
                    >
                      <FiPlay className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="p-2 rounded-lg border border-slate-205 dark:border-slate-800 text-rose-500 hover:bg-rose-500/5 transition"
                    title="Delete Job"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManageJobs;
