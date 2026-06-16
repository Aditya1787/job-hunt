import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen text-slate-700 dark:text-slate-350 leading-relaxed space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
        Terms & Conditions
      </h1>
      
      <p className="text-sm"><strong>Last Updated: June 15, 2026</strong></p>

      <p className="text-sm">
        By accessing or using CareerConnect, you agree to comply with and be bound by the following Terms & Conditions. Please review them carefully.
      </p>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-8">1. User Account Roles</h3>
      <p className="text-sm">
        Users must register under one of two role pathways: Candidate or Recruiter/Company. Administrators hold final oversight. You agree to provide accurate information and are fully responsible for maintaining credential confidentiality.
      </p>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-8">2. Recruitment Integrity & Verifications</h3>
      <p className="text-sm">
        All recruiters must submit company profile details for admin verification. Recruiters are restricted from posting false, misleading, or scam job openings. All posted openings enter a pending queue and will only display publicly once verified. Admins retain the right to suspend company records or block users violating safety parameters.
      </p>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-8">3. Intellectual Property</h3>
      <p className="text-sm">
        The CareerConnect portal, styling structures, AI matching models, and layout components are properties of CareerConnect. Resumes and candidate profile texts remain the intellectual property of their respective uploading creators.
      </p>
    </div>
  );
};

export default Terms;
