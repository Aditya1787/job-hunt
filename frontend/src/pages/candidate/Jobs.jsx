import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api.js';
import { 
  FiSearch, 
  FiMapPin, 
  FiBriefcase, 
  FiDollarSign, 
  FiSliders, 
  FiClock, 
  FiArrowRight, 
  FiChevronLeft, 
  FiChevronRight 
} from 'react-icons/fi';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search States derived from URL query strings
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [remoteType, setRemoteType] = useState(searchParams.get('remoteType') || '');
  const [employmentType, setEmploymentType] = useState(searchParams.get('employmentType') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  // Result States
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  // Trigger search fetch
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (location) queryParams.append('location', location);
      if (remoteType) queryParams.append('remoteType', remoteType);
      if (employmentType) queryParams.append('employmentType', employmentType);
      if (experience) queryParams.append('experience', experience);
      if (minSalary) queryParams.append('minSalary', minSalary);
      if (sort) queryParams.append('sort', sort);
      queryParams.append('page', page.toString());
      queryParams.append('limit', '6'); // 6 per page is visually perfect

      const response = await api.get(`/jobs?${queryParams.toString()}`);
      setJobs(response.data.jobs || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalJobs(response.data.totalJobs || 0);

      // Sync URL parameters
      setSearchParams(queryParams);
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
    } finally {
      setLoading(false);
    }
  }, [search, location, remoteType, employmentType, experience, minSalary, sort, page, setSearchParams]);

  useEffect(() => {
    fetchJobs();
  }, [page, sort, fetchJobs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset page to 1
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setRemoteType('');
    setEmploymentType('');
    setExperience('');
    setMinSalary('');
    setSort('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Header Search bar */}
      <form onSubmit={handleSearchSubmit} className="glass p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row gap-2 relative z-30">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-850">
          <FiSearch className="text-slate-400 w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, skills, or categories..."
            className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-850 dark:text-slate-250 placeholder-slate-400"
          />
        </div>

        <div className="flex-1 flex items-center gap-2 px-3 py-2">
          <FiMapPin className="text-slate-400 w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or 'Remote'"
            className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-850 dark:text-slate-250 placeholder-slate-400"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition"
        >
          Search
        </button>
      </form>

      {/* Main filter & grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar Filters */}
        <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 lg:sticky lg:top-24">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="font-extrabold text-sm flex items-center gap-1.5">
              <FiSliders /> Filters
            </span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Remote / Location filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Remote Setup</label>
            <select
              value={remoteType}
              onChange={(e) => { setRemoteType(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
            >
              <option value="">All Types</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Employment Structure</label>
            <select
              value={employmentType}
              onChange={(e) => { setEmploymentType(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
            >
              <option value="">All Structures</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
              <option value="fresher">Fresher</option>
            </select>
          </div>

          {/* Experience level */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Required Exp (Max Years)</label>
            <input
              type="number"
              min="0"
              value={experience}
              onChange={(e) => { setExperience(e.target.value); setPage(1); }}
              placeholder="e.g. 3 years"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
            />
          </div>

          {/* Minimum Salary */}
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Minimum Salary ($)</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={minSalary}
              onChange={(e) => { setMinSalary(e.target.value); setPage(1); }}
              placeholder="e.g. 80000"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Right side Grid results */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting / Results Count header */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold">{totalJobs} jobs found</span>
            
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none"
              >
                <option value="">Newest</option>
                <option value="salary_desc">Salary (High to Low)</option>
                <option value="salary_asc">Salary (Low to High)</option>
                <option value="experience_asc">Experience (Low to High)</option>
                <option value="deadline_asc">Closing Soonest</option>
              </select>
            </div>
          </div>

          {/* Job listings */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="h-44 rounded-2xl glass shimmer"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 glass border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-sm font-medium">
              No vacancy listings matched your filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-slate-350 dark:hover:border-slate-700 transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <img
                          src={job.company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                          alt={job.company?.companyName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-850 flex-shrink-0"
                        />
                        <div className="flex flex-col gap-1 items-end text-[9px] font-bold uppercase tracking-wider">
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/25 dark:text-primary-light">
                            {job.remoteType}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mt-1">
                            {job.employmentType}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold mt-4 line-clamp-1">{job.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{job.company?.companyName}</p>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {job.skillsRequired.slice(0, 3).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded text-[8px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 font-bold text-slate-500">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-850 mt-4 pt-4 flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-750 dark:text-slate-300">
                        ${job.salary?.min.toLocaleString()} - ${job.salary?.max.toLocaleString()}
                      </span>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-xs font-bold text-primary hover:text-primary-dark transition flex items-center gap-0.5"
                      >
                        Details &rarr;
                      </Link>
                    </div>

                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-50 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default Jobs;
