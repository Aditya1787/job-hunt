import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen text-slate-700 dark:text-slate-350 leading-relaxed space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
        Privacy Policy
      </h1>
      
      <p className="text-sm"><strong>Last Updated: June 15, 2026</strong></p>
      
      <p className="text-sm">
        At CareerConnect, we value and respect the privacy of our candidates, recruiters, and administrators. This policy describes how we collect, process, and protect your information when you interact with our platform.
      </p>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-8">1. Information We Collect</h3>
      <p className="text-sm">
        We collect credentials (email, hashed password) to provide authentication. For candidates, we collect optional profile telemetry such as name, contact information, location, work history, education history, and PDF resumes. For companies, we collect business names, logo images, physical headquarters, and website links.
      </p>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-8">2. AI Skill Extraction & Profile Fitting</h3>
      <p className="text-sm">
        Resumes uploaded to our servers are parsed locally via pdf-parse to extract skills. This textual content is referenced in our recommendation database matching candidates to jobs. We do not sell or lease candidate details to third-party databases.
      </p>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-8">3. WebSockets & Chat</h3>
      <p className="text-sm">
        We store messaging history (sender, receiver, text, and read timestamps) in our MongoDB instance to provide persistent chat threads. Connection signals are broadcasted to active recruiters to show online presences.
      </p>
    </div>
  );
};

export default Privacy;
