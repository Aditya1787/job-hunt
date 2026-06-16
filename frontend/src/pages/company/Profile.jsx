import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import api from '../../services/api.js';
import { FiUser, FiInfo, FiUploadCloud, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CompanyProfile = () => {
  const { user, syncProfile } = useAuth();
  const { showToast } = useNotifications();

  // Company Form fields
  const [companyName, setCompanyName] = useState(user?.companyProfile?.companyName || '');
  const [website, setWebsite] = useState(user?.companyProfile?.website || '');
  const [description, setDescription] = useState(user?.companyProfile?.description || '');
  const [companySize, setCompanySize] = useState(user?.companyProfile?.companySize || '1-10 employees');
  const [industry, setIndustry] = useState(user?.companyProfile?.industry || 'Software & SaaS');
  const [headquarters, setHeadquarters] = useState(user?.companyProfile?.headquarters || '');
  
  const [logoFile, setLogoFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName) {
      showToast('Company Name is required', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('website', website);
    formData.append('description', description);
    formData.append('companySize', companySize);
    formData.append('industry', industry);
    formData.append('headquarters', headquarters);

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    setUpdating(true);
    try {
      const res = await api.put('/companies/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      syncProfile(res.data.user);
      showToast('Company profile details saved successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to update details', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto space-y-6">
      
      <div>
        <Link to="/company/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-655 dark:hover:text-white transition">
          <FiArrowLeft /> Back to Hub
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Company Profile</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete company branding fields to establish credibility with candidates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-base font-bold">Branding & details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          
          {/* Logo uploader */}
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Company Logo</span>
            <div className="relative inline-block">
              <img
                src={logoFile ? URL.createObjectURL(logoFile) : (user?.profilePhoto || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100')}
                alt="Logo preview"
                className="w-24 h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 mx-auto"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
                className="hidden"
                id="company-logo-picker"
              />
              <label htmlFor="company-logo-picker" className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white cursor-pointer shadow">
                <FiUploadCloud className="w-3.5 h-3.5" />
              </label>
            </div>
          </div>

          <div className="sm:col-span-2 space-y-4">
            {/* Company Name */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. TechCorp SaaS"
                className="w-full px-4 py-2.5 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Corporate website */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Website Link</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://techcorp.example.com"
                className="w-full px-4 py-2.5 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400">Company Overview</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Introduce company values, product structures, and organizational culture..."
            className="w-full px-4 py-2.5 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Company Size */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Company Size</label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full px-3 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
            >
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="201-500 employees">201-500 employees</option>
              <option value="500+ employees">500+ employees</option>
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
            >
              <option value="Software & SaaS">Software & SaaS</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Marketing & Advertising">Marketing & Advertising</option>
              <option value="Education">Education</option>
            </select>
          </div>

          {/* Headquarters */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Headquarters Location</label>
            <input
              type="text"
              value={headquarters}
              onChange={(e) => setHeadquarters(e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="w-full px-4 py-2 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md transition"
        >
          {updating ? 'Saving details...' : 'Save Branding'}
        </button>

      </form>

    </div>
  );
};

export default CompanyProfile;
