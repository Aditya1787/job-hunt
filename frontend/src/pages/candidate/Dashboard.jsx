import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { 
  FiBriefcase, 
  FiBookmark, 
  FiActivity, 
  FiCheckCircle, 
  FiClock, 
  FiMapPin, 
  FiDollarSign, 
  FiZap,
  FiChevronRight
} from 'react-icons/fi';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [stats, setStats] = useState({ totalApps: 0, savedJobs: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch candidate dashboard telemetry
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch applications
        const appsRes = await api.get('/candidates/applications');
        setRecentApps(appsRes.data || []);
        
        // Fetch saved jobs list count
        const savedRes = await api.get('/candidates/saved-jobs');
        setStats({
          totalApps: appsRes.data?.length || 0,
          savedJobs: savedRes.data?.length || 0
        });

        // Fetch AI recommendations
        const recsRes = await api.get('/ai/recommendations');
        setRecommendations(recsRes.data || []);
      } catch (error) {
        console.error('Error loading candidate dashboard:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute profile completion percentage dynamically
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let score = 20; // base score for registering (Name/Email)
    const profile = user.candidateProfile || {};
    
    if (profile.phone) score += 10;
    if (profile.location) score += 10;
    if (profile.bio) score += 10;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.education && profile.education.length > 0) score += 10;
    if (profile.experience && profile.experience.length > 0) score += 10;
    if (profile.resumeUrl) score += 10;
    
    return score;
  };

  const completionRate = calculateProfileCompletion();

  // Helper for app status classes
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'applied': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'viewed': return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
      case 'shortlisted': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'interview': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'hired': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
      
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hi, {user?.name || 'Candidate'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review your job matches, track submitted applications, and coordinate messages.
          </p>
        </div>
        <Link
          to="/jobs"
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/20 transition duration-300"
        >
          Search Opportunities
        </Link>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric card 1 */}
        <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Applications</span>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.totalApps}</h3>
          </div>
          <span className="p-3 rounded-xl bg-primary/10 text-primary">
            <FiBriefcase className="w-6 h-6" />
          </span>
        </div>

        {/* Metric card 2 */}
        <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Saved Openings</span>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.savedJobs}</h3>
          </div>
          <span className="p-3 rounded-xl bg-accent/10 text-accent">
            <FiBookmark className="w-6 h-6" />
          </span>
        </div>

        {/* Dynamic Profile Completion Circular Ring */}
        <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Profile Status</span>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-2">
              {completionRate === 100 ? 'Ready for Hiring' : 'Incomplete Details'}
            </h3>
            <Link to="/candidate/profile" className="text-xs font-semibold text-primary hover:text-primary-dark transition block mt-1">
              Refine profile &rarr;
            </Link>
          </div>
          
          {/* Radial progress design */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray="163.3"
                strokeDashoffset={163.3 - (163.3 * completionRate) / 100}
                className="text-primary"
              />
            </svg>
            <span className="absolute text-xs font-extrabold">{completionRate}%</span>
          </div>
        </div>

      </div>

      {/* Main Content Grid (AI Recommendations & Recent Apps) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* AI recommended jobs column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-1.5">
              <FiZap className="text-accent fill-current animate-pulse" /> AI Recommended Jobs
            </h2>
            <span className="text-xs text-slate-400">Fits your skills</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((x) => (
                <div key={x} className="h-28 rounded-2xl glass shimmer"></div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              Add skills and upload your resume to generate intelligent recommendations!
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.slice(0, 4).map(({ job, score, breakdown }) => (
                <div
                  key={job._id}
                  className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={job.company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                      alt={job.company?.companyName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-850 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold line-clamp-1">{job.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{job.company?.companyName}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.skillsRequired.slice(0, 3).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 border-slate-100 dark:border-slate-850 pt-3 sm:pt-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Match score:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                        score > 80 ? 'bg-emerald-500/10 text-emerald-500' : score > 50 ? 'bg-teal-500/10 text-teal-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {score}%
                      </span>
                    </div>
                    
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-0.5"
                    >
                      Apply <FiChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications tracker panel */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent Applications</h2>
            <Link to="/candidate/applications" className="text-xs font-bold text-primary hover:text-primary-dark">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((x) => (
                <div key={x} className="h-20 rounded-2xl glass shimmer"></div>
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No applications submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentApps.slice(0, 3).map((app) => (
                <div
                  key={app._id}
                  className="glass p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-3"
                >
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold truncate">{app.job?.title || 'Job Listing Deleted'}</h4>
                    <p className="text-[10px] text-slate-455 mt-0.5 truncate">{app.job?.company?.companyName || 'N/A'}</p>
                    <span className="text-[9px] text-slate-400 block mt-1.5">
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border flex-shrink-0 ${
                    getStatusBadgeClass(app.status)
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default CandidateDashboard;
