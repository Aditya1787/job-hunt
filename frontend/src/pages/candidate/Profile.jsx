import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import api from '../../services/api.js';
import { 
  FiUser, 
  FiFileText, 
  FiMapPin, 
  FiPhone, 
  FiCpu, 
  FiPlus, 
  FiTrash2, 
  FiCheckCircle, 
  FiAlertCircle,
  FiUploadCloud
} from 'react-icons/fi';

const CandidateProfile = () => {
  const { user, syncProfile } = useAuth();
  const { showToast } = useNotifications();

  // Basic Info Form States
  const [phone, setPhone] = useState(user?.candidateProfile?.phone || '');
  const [location, setLocation] = useState(user?.candidateProfile?.location || '');
  const [bio, setBio] = useState(user?.candidateProfile?.bio || '');
  const [skills, setSkills] = useState((user?.candidateProfile?.skills || []).join(', '));
  const [linkedin, setLinkedin] = useState(user?.candidateProfile?.socialLinks?.linkedin || '');
  const [github, setGithub] = useState(user?.candidateProfile?.socialLinks?.github || '');
  const [portfolio, setPortfolio] = useState(user?.candidateProfile?.socialLinks?.portfolio || '');

  // Upload Resume file states
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState([]);

  // Sub-items List States
  const [experience, setExperience] = useState(user?.candidateProfile?.experience || []);
  const [education, setEducation] = useState(user?.candidateProfile?.education || []);
  const [projects, setProjects] = useState(user?.candidateProfile?.projects || []);

  // Sub-item Forms Temp States
  const [newExp, setNewExp] = useState({ title: '', company: '', startDate: '', endDate: '', current: false, description: '' });
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false, description: '' });
  const [newProj, setNewProj] = useState({ title: '', description: '', link: '', skillsUsed: '' });

  // Update profile handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      
      const payload = {
        phone,
        location,
        bio,
        skills: skillsArray,
        experience,
        education,
        projects,
        socialLinks: { linkedin, github, portfolio }
      };

      const res = await api.put('/candidates/profile', payload);
      syncProfile(res.data.user);
      showToast('Profile details updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Update failed', 'error');
    }
  };

  // Resume Upload Handler
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      showToast('Select a PDF resume to upload', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);

    setUploading(true);
    setExtractedSkills([]);
    try {
      const res = await api.post('/candidates/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      syncProfile(res.data.user);
      setSkills(res.data.user.candidateProfile.skills.join(', '));
      setExtractedSkills(res.data.extractedSkills || []);
      showToast('Resume uploaded and parsed successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'File upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  // List Management Helpers
  const addExperience = () => {
    if (!newExp.title || !newExp.company) {
      showToast('Title and Company are required', 'error');
      return;
    }
    setExperience([...experience, newExp]);
    setNewExp({ title: '', company: '', startDate: '', endDate: '', current: false, description: '' });
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    if (!newEdu.school || !newEdu.degree) {
      showToast('School and Degree are required', 'error');
      return;
    }
    setEducation([...education, newEdu]);
    setNewEdu({ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false, description: '' });
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Profile Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Provide your professional background, skills, and sync your resume for AI matching.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Upload Resume & AI Skill Extract */}
        <div className="space-y-6">
          
          <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-extrabold flex items-center gap-1.5 mb-4">
              <FiFileText className="text-primary" /> AI Resume parsing
            </h3>
            
            <form onSubmit={handleResumeUpload} className="space-y-4">
              {/* Drag and drop file select */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center cursor-pointer hover:border-primary transition">
                <FiUploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="hidden"
                  id="resume-file-picker"
                />
                <label htmlFor="resume-file-picker" className="cursor-pointer text-xs font-semibold text-primary block">
                  {resumeFile ? resumeFile.name : 'Choose PDF Resume'}
                </label>
                <span className="text-[10px] text-slate-400 block mt-1">Max file size 5MB</span>
              </div>

              {user?.candidateProfile?.resumeUrl && (
                <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <FiCheckCircle /> Resume uploaded:{' '}
                  <a href={`http://localhost:5000${user.candidateProfile.resumeUrl}`} target="_blank" rel="noreferrer" className="underline hover:text-emerald-600">
                    View Resume
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !resumeFile}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md shadow-primary/10 transition"
              >
                {uploading ? 'Parsing with AI...' : 'Upload & Sync Skills'}
              </button>
            </form>

            {/* AI parsed results */}
            {extractedSkills.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/25">
                <h4 className="text-xs font-bold text-accent dark:text-accent-light flex items-center gap-1">
                  <FiCpu /> Extracted Skills
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {extractedSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-[9px] bg-accent/20 text-accent dark:text-accent-light font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Links Cards */}
          <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold">Professional Links</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400">LinkedIn URL</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400">GitHub Profile</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400">Portfolio Website</label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://myportfolio.com"
                  className="w-full px-3.5 py-2 mt-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Profile Builders Form */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleUpdateProfile} className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-base font-bold">General Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <FiPhone /> Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 555-0199"
                  className="w-full px-4 py-2.5 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <FiMapPin /> Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York, NY"
                  className="w-full px-4 py-2.5 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">About Me / Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your professional capabilities..."
                className="w-full px-4 py-2.5 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              ></textarea>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <FiCpu /> Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, Node.js, JavaScript, Tailwind, Git"
                className="w-full px-4 py-2.5 mt-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Experience Builder */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              <h4 className="text-sm font-bold">Work Experience</h4>
              
              {/* Existing Exp items list */}
              {experience.length > 0 && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/20">
                  {experience.map((exp, i) => (
                    <div key={i} className="p-3 flex justify-between items-center gap-4 text-xs">
                      <div>
                        <p className="font-bold">{exp.title}</p>
                        <p className="text-slate-400 text-[10px]">{exp.company}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExperience(i)}
                        className="text-rose-500 hover:text-rose-600"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Exp Input block */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={newExp.title}
                    onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Start Date</label>
                    <input
                      type="date"
                      value={newExp.startDate}
                      onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">End Date</label>
                    <input
                      type="date"
                      disabled={newExp.current}
                      value={newExp.endDate}
                      onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="exp-current"
                    checked={newExp.current}
                    onChange={(e) => setNewExp({ ...newExp, current: e.target.checked })}
                    className="rounded text-primary"
                  />
                  <label htmlFor="exp-current" className="text-[10px] text-slate-400">Currently work here</label>
                </div>

                <textarea
                  rows={2}
                  placeholder="Responsibilities & achievements..."
                  value={newExp.description}
                  onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none"
                ></textarea>

                <button
                  type="button"
                  onClick={addExperience}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 font-bold text-[10px] text-primary"
                >
                  <FiPlus /> Add Job Entry
                </button>
              </div>
            </div>

            {/* Education Builder */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              <h4 className="text-sm font-bold">Education History</h4>
              
              {/* Existing Edu items list */}
              {education.length > 0 && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/20">
                  {education.map((edu, i) => (
                    <div key={i} className="p-3 flex justify-between items-center gap-4 text-xs">
                      <div>
                        <p className="font-bold">{edu.degree} in {edu.fieldOfStudy}</p>
                        <p className="text-slate-400 text-[10px]">{edu.school}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducation(i)}
                        className="text-rose-500 hover:text-rose-600"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Edu Input block */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="School / University"
                    value={newEdu.school}
                    onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Degree (e.g. BS)"
                    value={newEdu.degree}
                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Field of Study (e.g. Comp Sci)"
                    value={newEdu.fieldOfStudy}
                    onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none col-span-2"
                  />
                </div>

                <button
                  type="button"
                  onClick={addEducation}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 font-bold text-[10px] text-primary"
                >
                  <FiPlus /> Add Degree
                </button>
              </div>
            </div>

            {/* Save trigger */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-primary/30 transition"
            >
              Save Profile Changes
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default CandidateProfile;
