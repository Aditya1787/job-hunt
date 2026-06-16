import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { 
  FiMapPin, 
  FiBriefcase, 
  FiDollarSign, 
  FiCalendar, 
  FiUsers, 
  FiBookmark, 
  FiShare2, 
  FiAlertTriangle,
  FiArrowLeft,
  FiFileText,
  FiZap,
  FiCheckCircle
} from 'react-icons/fi';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  // Modal States
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Form States
  const [coverLetter, setCoverLetter] = useState('');
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [customResume, setCustomResume] = useState(null);
  const [submittingApply, setSubmittingApply] = useState(false);

  const [reportType, setReportType] = useState('spam');
  const [reportDesc, setReportDesc] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  // Load Job details and status variables
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);

        if (user && user.role === 'candidate') {
          // Check if already saved
          const savedRes = await api.get('/candidates/saved-jobs');
          const savedList = savedRes.data || [];
          setIsSaved(savedList.some(item => item._id.toString() === id));

          // Check if already applied
          const appsRes = await api.get('/candidates/applications');
          const appsList = appsRes.data || [];
          setHasApplied(appsList.some(app => app.job && app.job._id.toString() === id));
        }
      } catch (error) {
        console.error('Error loading job details:', error.message);
        showToast('Job listing not found', 'error');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, user, navigate, showToast]);

  // Toggle Save Job state
  const handleSaveToggle = async () => {
    if (!user) {
      showToast('Please sign in to save jobs', 'warning');
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await api.delete(`/candidates/save-job/${id}`);
        setIsSaved(false);
        showToast('Job unsaved successfully', 'success');
      } else {
        await api.post(`/candidates/save-job/${id}`);
        setIsSaved(true);
        showToast('Job saved successfully!', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Action failed', 'error');
    }
  };

  // Copy Link to Clipboard
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Job link copied to clipboard!', 'success');
  };

  // Submit Application handler
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Sign in as candidate to apply', 'warning');
      navigate('/login');
      return;
    }

    if (!useProfileResume && !customResume) {
      showToast('Please upload a resume file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    
    if (!useProfileResume && customResume) {
      formData.append('resume', customResume);
    }

    setSubmittingApply(true);
    try {
      await api.post(`/jobs/${id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHasApplied(true);
      setApplyModalOpen(false);
      showToast('Applied successfully! Recruiter notified.', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Application failed', 'error');
    } finally {
      setSubmittingApply(false);
    }
  };

  // Submit spam report
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Sign in to file complaints', 'warning');
      return;
    }
    if (!reportDesc.trim()) {
      showToast('Describe the complaint reason', 'error');
      return;
    }

    setSubmittingReport(true);
    try {
      await api.post(`/jobs/${id}/report`, { type: reportType, description: reportDesc });
      setReportModalOpen(false);
      setReportDesc('');
      showToast('Job reported. Admin team will review.', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Report failed', 'error');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <div className="h-48 rounded-3xl glass shimmer"></div>
        <div className="h-96 rounded-3xl glass shimmer"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto space-y-8">
      
      {/* Back button */}
      <div>
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-650 dark:hover:text-white transition">
          <FiArrowLeft /> Back to Listings
        </Link>
      </div>

      {/* Hero Header panel */}
      <div className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <img
              src={job.company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
              alt={job.company?.companyName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {job.title}
              </h1>
              <p className="text-sm text-slate-400 mt-1">{job.company?.companyName}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1">
                  <FiMapPin /> {job.location} ({job.remoteType})
                </span>
                <span className="flex items-center gap-1">
                  <FiBriefcase /> {job.employmentType}
                </span>
              </div>
            </div>
          </div>

          {/* Quick status actions */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-end">
            <button
              onClick={handleSaveToggle}
              className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-center ${
                isSaved ? 'text-amber-500' : 'text-slate-400'
              }`}
              title="Save Job"
            >
              <FiBookmark className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 transition flex items-center justify-center"
              title="Share Link"
            >
              <FiShare2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-455 hover:text-rose-500 transition flex items-center justify-center"
              title="Report listing"
            >
              <FiAlertTriangle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Apply action row */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-xs">
            <span className="text-slate-400 block font-semibold">Salary Range</span>
            <span className="text-lg font-bold text-slate-800 dark:text-white mt-1">
              ${job.salary?.min.toLocaleString()} - ${job.salary?.max.toLocaleString()} / year
            </span>
          </div>

          {/* Applied state checks */}
          {user?.role === 'company' ? (
            <div className="text-xs text-slate-400 font-semibold">Logged in as Recruiter</div>
          ) : hasApplied ? (
            <span className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 font-bold text-sm flex items-center gap-1.5 shadow-sm">
              <FiCheckCircle /> Applied
            </span>
          ) : (
            <button
              onClick={() => setApplyModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-primary/20 transition duration-200 flex items-center gap-1.5"
            >
              <FiZap /> Apply Now
            </button>
          )}
        </div>

      </div>

      {/* Body specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Main description column */}
        <div className="md:col-span-2 glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          
          <div>
            <h3 className="font-extrabold text-base mb-4">Job Description</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-850 pt-6">
              <h3 className="font-extrabold text-base mb-4">Benefits & Perks</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {job.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Sidebar Info columns */}
        <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="font-extrabold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Vacancy Details</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Experience Level</span>
              <span className="font-bold">{job.experience} years required</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Openings</span>
              <span className="font-bold">{job.openings} positions</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Deadline</span>
              <span className="font-bold">{new Date(job.deadline).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Category</span>
              <span className="font-bold">{job.jobCategory}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3">
            <h4 className="text-xs font-bold">Skills Required</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skillsRequired.map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-lg text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 font-bold text-slate-500">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* APPLY MODAL */}
      {applyModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="max-w-lg w-full glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6">
            <h3 className="text-lg font-bold">Submit Job Application</h3>
            
            <form onSubmit={handleApplySubmit} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Cover Letter</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself and describe why you are the best fit for this role..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
                ></textarea>
              </div>

              {/* Toggle resume sources */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase text-slate-400">Resume Source</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input
                      type="radio"
                      checked={useProfileResume}
                      onChange={() => setUseProfileResume(true)}
                    />
                    Use Profile Resume
                  </label>
                  
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input
                      type="radio"
                      checked={!useProfileResume}
                      onChange={() => setUseProfileResume(false)}
                    />
                    Upload Custom Resume
                  </label>
                </div>
              </div>

              {/* Custom Resume file upload */}
              {!useProfileResume && (
                <div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCustomResume(e.target.files[0])}
                    className="w-full text-xs"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">Requires a PDF document</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApply}
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md"
                >
                  {submittingApply ? 'Submitting Application...' : 'Send Application'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-1.5 text-rose-500">
              <FiAlertTriangle /> Report Job Listing
            </h3>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Reason Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none"
                >
                  <option value="spam">Spam Posting</option>
                  <option value="fake_job">Fake Job / Scam Offer</option>
                  <option value="complaint">Incorrect Description / Salary</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Description details</label>
                <textarea
                  rows={3}
                  required
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Describe the reason for reporting..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md"
                >
                  {submittingReport ? 'Filing Report...' : 'File Report'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobDetails;
