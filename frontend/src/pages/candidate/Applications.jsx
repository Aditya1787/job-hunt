import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { FiBriefcase, FiMapPin, FiCalendar, FiClock, FiCheck, FiX } from 'react-icons/fi';

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications list on load
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/candidates/applications');
        setApplications(response.data || []);
      } catch (error) {
        console.error('Error fetching applications:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Application pipeline statuses
  const statusSteps = ['applied', 'viewed', 'shortlisted', 'interview', 'hired'];

  const getStepIndex = (status) => {
    if (status === 'rejected') return -1;
    return statusSteps.indexOf(status);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My Applications</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor status updates, review interview schedules, and check feedback logs.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((s) => (
            <div key={s} className="h-40 rounded-2xl glass shimmer"></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 glass border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
          <FiBriefcase className="w-12 h-12 mx-auto mb-4 text-slate-350" />
          <p className="font-semibold text-sm">No applications submitted yet.</p>
          <Link to="/jobs" className="text-xs text-primary hover:text-primary-dark transition font-semibold mt-2 block">
            Browse live job vacancies &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStepIdx = getStepIndex(app.status);
            const isRejected = app.status === 'rejected';

            return (
              <div
                key={app._id}
                className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition duration-200 space-y-6"
              >
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={app.job?.company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                      alt={app.job?.company?.companyName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 dark:border-slate-850"
                    />
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">
                        {app.job ? (
                          <Link to={`/jobs/${app.job._id}`} className="hover:underline text-slate-900 dark:text-white">
                            {app.job.title}
                          </Link>
                        ) : (
                          <span className="text-slate-400">Deleted Job Posting</span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400">{app.job?.company?.companyName}</p>
                      
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <FiMapPin /> {app.job?.location} ({app.job?.remoteType})
                        </span>
                        <span>&bull;</span>
                        <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border self-start sm:self-auto ${
                    isRejected 
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                      : app.status === 'hired'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }`}>
                    {app.status}
                  </span>
                </div>

                {/* Progress flow map */}
                {!isRejected ? (
                  <div className="w-full pt-4">
                    <div className="relative flex items-center justify-between">
                      {/* Line background */}
                      <div className="absolute left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>
                      
                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step} className="flex flex-col items-center relative z-10">
                            <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-extrabold ${
                              isDone
                                ? 'bg-primary border-primary text-white'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                            }`}>
                              {isDone && idx !== currentStepIdx ? <FiCheck className="w-4 h-4" /> : idx + 1}
                            </span>
                            <span className={`text-[9px] uppercase tracking-wider font-bold mt-2 ${
                              isCurrent ? 'text-primary' : 'text-slate-400'
                            }`}>
                              {step === 'interview' ? 'Interview' : step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-3 text-xs text-rose-600 dark:text-rose-455">
                    <FiX className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Application Closed</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">We regret to inform you that the recruiter closed this application.</p>
                    </div>
                  </div>
                )}

                {/* Interview Date Details popup panel */}
                {app.status === 'interview' && app.interviewDate && (
                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <FiCalendar /> Interview Invitation
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Details: {app.interviewDetails || 'Virtual meeting link will be shared via chat.'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end flex-shrink-0 text-purple-600 dark:text-purple-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <FiCalendar /> {new Date(app.interviewDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 mt-0.5">
                        <FiClock /> {new Date(app.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CandidateApplications;
