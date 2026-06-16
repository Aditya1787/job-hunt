import React from 'react';
import { FiCheck, FiCpu, FiAward, FiShield } from 'react-icons/fi';

const About = () => {
  return (
    <div className="w-full flex flex-col py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen gap-16">
      
      {/* Title Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Our Mission</h1>
        <p className="text-slate-400 mt-2 text-sm max-w-xl mx-auto">
          We believe job searches and recruiting pipelines should be transparent, lightning-fast, and powered by matching intelligence.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <FiCpu className="w-6 h-6" />
          </span>
          <h3 className="font-bold text-base">AI Mapping</h3>
          <p className="text-xs text-slate-400 mt-2">
            Dynamic resume parsing and matching metrics remove traditional keyword filters and focus on direct capability matching.
          </p>
        </div>

        <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
            <FiShield className="w-6 h-6" />
          </span>
          <h3 className="font-bold text-base">Verified Security</h3>
          <p className="text-xs text-slate-400 mt-2">
            Every business logo, corporate website, and job posting goes through a manual admin verification queue to eliminate spam.
          </p>
        </div>

        <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
            <FiAward className="w-6 h-6" />
          </span>
          <h3 className="font-bold text-base">Duplex Chat</h3>
          <p className="text-xs text-slate-400 mt-2">
            Skip email lag. Real-time direct chat and scheduling notifications bring candidate and company representatives together.
          </p>
        </div>

      </div>

      {/* Corporate profile narrative */}
      <div className="glass p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold">Bridging Opportunity Gaps</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
            CareerConnect started as a lightweight utility to match resume skills with database jobs. Today, it has grown into a production-ready hiring ecosystem. We coordinate role access levels, protect candidate privacy, and give company recruiters tools to manage their candidates.
          </p>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {['100% Secure Auth (JWT)', 'Real-time WebSocket Chat', 'Excel / CSV Pipeline Export', 'Responsive Dark & Light Mode'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                  <FiCheck className="w-3.5 h-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex-1 w-full flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400"
            alt="Colleagues collaborating"
            className="rounded-2xl shadow-xl w-full max-w-sm object-cover aspect-video"
          />
        </div>
      </div>

    </div>
  );
};

export default About;
