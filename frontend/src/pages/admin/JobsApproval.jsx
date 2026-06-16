import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiBriefcase, FiCheck, FiX, FiAlertCircle, FiArrowLeft, FiInfo } from 'react-icons/fi';

const AdminJobsApproval = () => {
  const { showToast } = useNotifications();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/jobs/approvals');
      setJobs(res.data || []);
    } catch (err) {
      console.error('Error fetching pending jobs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await api.put(`/admin/jobs/${id}/verify`, { status: 'approved' });
      showToast(res.data.message || 'Job approved successfully', 'success');
      fetchPendingJobs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Approval failed', 'error');
    }
  };

  const handleOpenRejectModal = (job) => {
    setSelectedJob(job);
    setRejectionReason('');
    setModalOpen(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      showToast('Please specify a rejection reason', 'error');
      return;
    }

    try {
      const res = await api.put(`/admin/jobs/${selectedJob._id}/verify`, {
        status: 'rejected',
        rejectionReason
      });
      showToast(res.data.message || 'Job listing rejected', 'success');
      setModalOpen(false);
      fetchPendingJobs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Rejection failed', 'error');
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-6">
      
      <div>
        <a href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-655 dark:hover:text-white transition">
          <FiArrowLeft /> Back to Console
        </a>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pending Vacancy Verifications</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review details of job listings submitted by recruiters before authorizing publication.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(x => <div key={x} className="h-32 rounded-2xl glass shimmer"></div>)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 glass border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-sm font-medium">
          No job listings currently require verification approval.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-extrabold text-sm sm:text-base">{job.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
                    Verification Pending
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-455 font-semibold">
                  <span>Company: <span className="text-slate-800 dark:text-white">{job.company?.companyName}</span></span>
                  <span>&bull;</span>
                  <span>Location: {job.location} ({job.remoteType})</span>
                  <span>&bull;</span>
                  <span>Salary: ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</span>
                  <span>&bull;</span>
                  <span>Experience: {job.experience} years</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase mb-1">Description snippet</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex md:flex-col gap-2 w-full md:w-auto self-stretch md:self-auto justify-end border-t md:border-t-0 border-slate-105 dark:border-slate-850 pt-3 md:pt-0">
                <button
                  onClick={() => handleApprove(job._id)}
                  className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1"
                >
                  <FiCheck /> Approve
                </button>
                <button
                  onClick={() => handleOpenRejectModal(job)}
                  className="flex-1 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1"
                >
                  <FiX /> Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* REJECT JOB MODAL */}
      {modalOpen && selectedJob && (
        <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-1 text-rose-500">
              <FiAlertCircle /> Specify Rejection Reason
            </h3>

            <p className="text-xs text-slate-405 leading-relaxed">
              This message will be sent to recruiter: <span className="font-bold text-slate-700 dark:text-slate-200">{selectedJob.postedBy?.name}</span> for job posting: <span className="font-bold text-slate-700 dark:text-slate-200">"{selectedJob.title}"</span>.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 font-semibold">
                  Reason Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Specify details, e.g. Salary incorrect, missing description details..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md"
                >
                  Reject Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminJobsApproval;
