import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { 
  FiSearch, 
  FiSliders, 
  FiFileText, 
  FiCalendar, 
  FiMessageSquare, 
  FiUser, 
  FiMapPin, 
  FiDownload, 
  FiCheck, 
  FiX, 
  FiCpu,
  FiArrowLeft
} from 'react-icons/fi';

const Applicants = () => {
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Interview Modal
  const [activeApp, setActiveApp] = useState(null); // application being updated
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewDetails, setInterviewDetails] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchApplicants = async () => {
    try {
      const response = await api.get(`/companies/applicants?status=${status}&search=${search}`);
      setApplicants(response.data || []);
    } catch (error) {
      console.error('Error fetching applicants:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [status, search]);

  // Handle simple status changes (Shortlist, Reject, Hire)
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.put(`/companies/applications/${appId}`, { status: newStatus });
      showToast(res.data.message || `Status updated to ${newStatus}`, 'success');
      fetchApplicants();
    } catch (err) {
      showToast(err.response?.data?.message || 'Status update failed', 'error');
    }
  };

  // Open interview modal
  const openInterviewModal = (app) => {
    setActiveApp(app);
    setInterviewDate('');
    setInterviewDetails('');
    setModalOpen(true);
  };

  // Submit interview schedule
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!interviewDate) {
      showToast('Interview date and time are required', 'error');
      return;
    }

    try {
      const res = await api.put(`/companies/applications/${activeApp._id}`, {
        status: 'interview',
        interviewDate,
        interviewDetails
      });
      showToast(res.data.message || 'Interview scheduled successfully!', 'success');
      setModalOpen(false);
      fetchApplicants();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to schedule interview', 'error');
    }
  };

  // Export pipeline to CSV
  const handleCSVExport = async () => {
    try {
      const response = await api.get('/companies/export-applicants', { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'careerconnect-applicants.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showToast('Applicants data exported successfully!', 'success');
    } catch (err) {
      showToast('Failed to export applicants to CSV', 'error');
    }
  };

  // Open Chat message thread
  const openChatThread = (candidateId) => {
    navigate(`/company/messages?otherId=${candidateId}`);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Applicant Pipeline</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Shortlist matching candidate profiles, schedule interviews, and export pipelines.
          </p>
        </div>
        <button
          onClick={handleCSVExport}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <FiDownload /> Export Excel (CSV)
        </button>
      </div>

      {/* Filters bar */}
      <div className="glass p-4 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-30">
        
        {/* Name Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg">
          <FiSearch className="text-slate-400 w-4 h-4 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by candidate name..."
            className="w-full bg-transparent border-none focus:outline-none text-xs text-slate-800 dark:text-slate-250 placeholder-slate-405"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-850 rounded-lg">
          <FiSliders className="text-slate-400 w-4 h-4 flex-shrink-0" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-xs text-slate-805 dark:text-slate-250"
          >
            <option value="">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="viewed">Viewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview Scheduled</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

      </div>

      {/* Main Grid list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(x => <div key={x} className="h-32 rounded-2xl glass shimmer"></div>)}
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center py-16 glass border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-sm font-medium">
          No applicants match your filter settings.
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition duration-200 space-y-4"
            >
              
              {/* Header row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-3">
                <div>
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <FiUser className="text-slate-400" /> {app.candidate?.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Applied to: <span className="font-semibold">{app.job?.title}</span></p>
                </div>
                
                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                  app.status === 'hired'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : app.status === 'rejected'
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    : app.status === 'interview'
                    ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}>
                  {app.status}
                </span>
              </div>

              {/* Bio & Resume / phone details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                <div className="space-y-1.5">
                  <p className="text-slate-400 font-semibold uppercase text-[9px]">Contact Info</p>
                  <p className="text-slate-800 dark:text-slate-200">Email: {app.candidate?.email}</p>
                  <p className="text-slate-800 dark:text-slate-200">Phone: {app.candidate?.candidateProfile?.phone || 'N/A'}</p>
                  <p className="text-slate-800 dark:text-slate-200">Location: {app.candidate?.candidateProfile?.location || 'N/A'}</p>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <p className="text-slate-400 font-semibold uppercase text-[9px] flex items-center gap-0.5">
                    <FiCpu /> Matching Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(app.candidate?.candidateProfile?.skills || []).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Actions row */}
              <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex flex-wrap gap-2 justify-between items-center text-xs">
                <div className="flex gap-2">
                  {/* Resume PDF view */}
                  {app.resume && (
                    <a
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${app.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold flex items-center gap-1"
                    >
                      <FiFileText /> View Resume
                    </a>
                  )}

                  {/* Message/Chat */}
                  <button
                    onClick={() => openChatThread(app.candidate?._id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold flex items-center gap-1"
                  >
                    <FiMessageSquare /> Chat Candidate
                  </button>
                </div>

                {/* Pipeline statuses updates */}
                {app.status !== 'hired' && app.status !== 'rejected' && (
                  <div className="flex gap-1.5 flex-wrap">
                    {app.status === 'applied' && (
                      <button
                        onClick={() => handleStatusChange(app._id, 'shortlisted')}
                        className="px-2.5 py-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent dark:text-accent-light font-bold"
                      >
                        Shortlist
                      </button>
                    )}

                    {app.status !== 'interview' && (
                      <button
                        onClick={() => openInterviewModal(app)}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold flex items-center gap-0.5"
                      >
                        <FiCalendar /> Schedule
                      </button>
                    )}

                    {app.status === 'interview' && (
                      <button
                        onClick={() => handleStatusChange(app._id, 'hired')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5"
                      >
                        <FiCheck /> Hire
                      </button>
                    )}

                    <button
                      onClick={() => handleStatusChange(app._id, 'rejected')}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold flex items-center gap-0.5"
                    >
                      <FiX /> Reject
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {modalOpen && activeApp && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
              <FiCalendar /> Schedule Recruiter Interview
            </h3>
            
            <p className="text-xs text-slate-400">
              Scheduling interview for <span className="font-bold text-slate-705 dark:text-slate-250">{activeApp.candidate?.name}</span> for role: <span className="font-bold text-slate-705 dark:text-slate-250">{activeApp.job?.title}</span>.
            </p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Interview Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Meeting Link or Location</label>
                <textarea
                  rows={2}
                  value={interviewDetails}
                  onChange={(e) => setInterviewDetails(e.target.value)}
                  placeholder="e.g. Google Meet link, or office Room 101 instructions..."
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
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
                >
                  Schedule Slot
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Applicants;
