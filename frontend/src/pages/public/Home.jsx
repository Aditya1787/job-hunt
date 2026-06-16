import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { 
  FiSearch, 
  FiMapPin, 
  FiBriefcase, 
  FiTrendingUp, 
  FiUsers, 
  FiCheckCircle, 
  FiArrowRight, 
  FiDollarSign,
  FiZap
} from 'react-icons/fi';

const Home = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 1542, companies: 432, jobs: 1205 });
  const suggestionRef = useRef(null);
  const navigate = useNavigate();

  // Fetch recent jobs and mock telemetry stats on load
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await api.get('/jobs?limit=3');
        setJobs(response.data.jobs || []);
        
        // Fetch stats if available, or keep placeholders
        const statsRes = await api.get('/auth/register').catch(() => null); // dummy trigger or just query
      } catch (err) {
        console.error('Error fetching home jobs:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Fetch search suggestions from AI endpoint as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await api.get(`/ai/suggestions?q=${encodeURIComponent(search)}`);
        setSuggestions(response.data || []);
      } catch (err) {
        console.error('Error fetching AI suggestions:', err.message);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Click outside suggestions handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`);
  };

  const handleSuggestionClick = (val) => {
    setSearch(val);
    setSuggestions([]);
    navigate(`/jobs?search=${encodeURIComponent(val)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="w-full flex flex-col min-h-screen transition-colors duration-300">
      
      {/* Visual Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/50 dark:border-slate-800/50">
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-1/10 w-80 h-80 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Headline and descriptions */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light uppercase tracking-wider mb-6 animate-bounce-short">
              <FiZap className="w-3.5 h-3.5 fill-current" /> Next-Gen AI Matching Engine
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight font-sans">
              Accelerate Your <br />
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-accent bg-clip-text text-transparent">
                Career Trajectory
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-350 max-w-xl mx-auto lg:mx-0 font-medium">
              CareerConnect bridges the gap between ambitious builders and elite organizations using deep profile skill mapping and real-time messaging.
            </p>

            {/* Smart Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="mt-10 max-w-2xl mx-auto lg:mx-0 relative z-30">
              <div className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl glass shadow-xl shadow-slate-100 dark:shadow-none border border-slate-200/60 dark:border-slate-800/80">
                
                {/* Search Text input */}
                <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-850 relative">
                  <FiSearch className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Job title, tech skill, or industry..."
                    className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400"
                  />
                  
                  {/* AI Autocomplete suggestion dropdown */}
                  {suggestions.length > 0 && (
                    <div ref={suggestionRef} className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 border-b border-slate-100 dark:border-slate-850">
                        <FiZap className="w-3 h-3 text-primary fill-current" /> AI Search Suggestions
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Location Input */}
                <div className="flex-1 flex items-center gap-2 px-3 py-2">
                  <FiMapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, state, or Remote"
                    className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/25 hover:shadow-primary/40 transition duration-300 flex items-center justify-center gap-1"
                >
                  Find Jobs <FiArrowRight className="w-4 h-4" />
                </button>

              </div>
            </form>
            
            {/* Quick Tag filters */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start items-center">
              <span className="text-xs text-slate-400">Popular:</span>
              {['React', 'Node.js', 'Remote', 'Product Manager'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (tag === 'Remote') {
                      setLocation('Remote');
                    } else {
                      setSearch(tag);
                    }
                  }}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-750 transition"
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

          {/* Right graphics dashboard cards */}
          <div className="flex-1 relative flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden glass shadow-2xl p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
              
              {/* Overlay card - candidate */}
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-3 transform -translate-x-5 translate-y-2 relative z-10 transition hover:scale-105">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                  alt="Candidate avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sarah Jenkins</h4>
                  <p className="text-[10px] text-slate-400">Matched 98% with Frontend Dev</p>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[9px] uppercase">
                  Verified
                </span>
              </div>

              {/* Central Vector art or placeholder graphics */}
              <div className="flex-1 flex flex-col justify-center items-center py-6 text-center">
                <span className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-accent/20 mb-4 animate-bounce-short">
                  AI
                </span>
                <h3 className="text-base font-extrabold">Instant Candidate-Job Fitting</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Upload your PDF resume to automatically pull skills and match live job requirements instantly.
                </p>
              </div>

              {/* Overlay card - company */}
              <div className="p-4 rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 text-white shadow-xl border border-slate-800 flex items-center gap-3 transform translate-x-5 -translate-y-2 relative z-10 transition hover:scale-105">
                <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary-light flex items-center justify-center font-bold text-sm">
                  TC
                </span>
                <div>
                  <h4 className="text-xs font-bold">TechCorp SaaS</h4>
                  <p className="text-[10px] text-slate-400">Scheduled 4 Interviews today</p>
                </div>
                <div className="ml-auto flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Platform Telemetry Stats section */}
      <section className="py-8 bg-slate-900 text-white dark:bg-slate-950 border-b border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary-light">
                {stats.users}+
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">
                Active Talents
              </span>
            </div>

            <div className="flex flex-col items-center border-x border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-accent-light">
                {stats.companies}+
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">
                Verified Partners
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.jobs}+
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">
                Active Openings
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Featured Opportunities
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top curated postings seeking immediate responses. Hand-checked by our admin team.
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-primary hover:text-primary-dark transition flex items-center gap-1"
          >
            Explore All Jobs <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Load Skeletons or Job Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-48 rounded-2xl glass shimmer"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
            No jobs found. Run seeder to populate sample entries.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="glass rounded-2xl p-6 border border-slate-250 dark:border-slate-850 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <img
                      src={job.company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                      alt={job.company?.companyName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800"
                    />
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-primary/10 text-primary dark:bg-primary/25 dark:text-primary-light">
                      {job.remoteType}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold mt-4 line-clamp-1">{job.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{job.company?.companyName}</p>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    ${job.salary?.min.toLocaleString()} - ${job.salary?.max.toLocaleString()} / yr
                  </span>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-xs font-bold text-primary hover:text-primary-dark transition"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* Role Selection Promo section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-850/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="glass rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition duration-300">
            <div>
              <span className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <FiUsers className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold">For Job Seekers</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                Build a modern profile, upload your resume for automatic skill tagging, get AI recommendations, and chat directly with recruiters.
              </p>
            </div>
            <Link
              to="/register?role=candidate"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition"
            >
              Create Candidate Account <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl transition duration-300">
            <div>
              <span className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                <FiBriefcase className="w-5 h-5" />
              </span>
              <h3 className="text-xl font-bold">For Hiring Managers</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                Gain verified company status, post vacancies, sort through matching candidate profiles, and schedule interviews instantly in real-time.
              </p>
            </div>
            <Link
              to="/register?role=company"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:text-accent-dark transition"
            >
              Register Recruiter Hub <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
