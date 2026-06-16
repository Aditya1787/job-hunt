import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { FiPlusCircle, FiArrowLeft, FiAlertCircle, FiInfo } from 'react-icons/fi';

const PostJob = () => {
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [companyVerified, setCompanyVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  // Form States
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    salaryMin: '',
    salaryMax: '',
    experience: '',
    location: '',
    employmentType: 'full-time',
    jobCategory: 'Technology',
    openings: '1',
    deadline: '',
    remoteType: 'remote',
    benefits: ''
  });
  const [loading, setLoading] = useState(false);

  // Verify company exists and is approved on load
  useEffect(() => {
    const verifyCompanyStatus = async () => {
      try {
        const response = await api.get('/companies/profile');
        if (response.data && response.data.verificationStatus === 'approved') {
          setCompanyVerified(true);
        } else {
          setCompanyVerified(false);
        }
      } catch (err) {
        console.error('Error verifying company:', err.message);
        setCompanyVerified(false);
      } finally {
        setChecking(false);
      }
    };
    verifyCompanyStatus();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.skillsRequired || !formData.salaryMin || !formData.salaryMax || !formData.location || !formData.deadline) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      showToast('Min salary cannot exceed Max salary', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/companies/jobs', formData);
      showToast(res.data.message || 'Job submitted for admin approval!', 'success');
      navigate('/company/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Posting failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        <div className="h-96 rounded-3xl glass shimmer"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto space-y-6">
      
      <div>
        <Link to="/company/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-650 dark:hover:text-white transition">
          <FiArrowLeft /> Back to Hub
        </Link>
      </div>

      {!companyVerified ? (
        <div className="glass p-6 rounded-3xl border border-rose-500/10 dark:border-rose-500/20 bg-rose-500/5 text-center space-y-4">
          <FiAlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-base font-extrabold text-rose-600 dark:text-rose-455">Recruiter Profile Verification Required</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            You cannot post job openings until your company profile has been approved by our platform administrator. Please complete your profile and wait for verification.
          </p>
          <Link
            to="/company/profile"
            className="inline-block px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md shadow-primary/20 transition"
          >
            Go to Company Profile
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold flex items-center gap-1.5">
              <FiPlusCircle /> Post a Job opening
            </h2>
            <div className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <FiInfo /> Requires Admin Approval
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Job Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. MERN Stack Engineer"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-450 dark:text-slate-400 mb-1.5">Description *</label>
            <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Outline the responsibilities, daily work, and matching traits you seek..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Job Category</label>
              <select
                name="jobCategory"
                value={formData.jobCategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
              >
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Product Management">Product Management</option>
                <option value="Sales">Sales</option>
                <option value="Analytics">Analytics</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Location *</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-450 dark:text-slate-400 mb-1.5">Required Skills (Comma-separated) *</label>
            <input
              type="text"
              name="skillsRequired"
              required
              value={formData.skillsRequired}
              onChange={handleInputChange}
              placeholder="e.g. React, Node.js, Express, Tailwind, CSS"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Salary Min */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Salary Min ($) *</label>
              <input
                type="number"
                name="salaryMin"
                required
                value={formData.salaryMin}
                onChange={handleInputChange}
                placeholder="e.g. 80000"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Salary Max */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Salary Max ($) *</label>
              <input
                type="number"
                name="salaryMax"
                required
                value={formData.salaryMax}
                onChange={handleInputChange}
                placeholder="e.g. 120000"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Exp */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Required Exp (Years) *</label>
              <input
                type="number"
                name="experience"
                required
                min="0"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g. 2"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Remote type */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Remote Option</label>
              <select
                name="remoteType"
                value={formData.remoteType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Job Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="fresher">Fresher</option>
              </select>
            </div>

            {/* Openings */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-450 dark:text-slate-400 mb-1.5">Positions</label>
              <input
                type="number"
                name="openings"
                min="1"
                value={formData.openings}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Closing Date *</label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Benefits & perks (Comma-separated)</label>
            <input
              type="text"
              name="benefits"
              value={formData.benefits}
              onChange={handleInputChange}
              placeholder="e.g. Stock Options, Health Care, Gym Membership, Remote Stipend"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition"
          >
            {loading ? 'Posting listing...' : 'Submit Vacancy'}
          </button>

        </form>
      )}

    </div>
  );
};

export default PostJob;
