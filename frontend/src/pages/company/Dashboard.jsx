import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { FiBriefcase, FiUsers, FiClock, FiPlusCircle, FiFileText, FiAlertCircle } from 'react-icons/fi';

// Register ChartJS elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CompanyDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch company analytics & posted jobs list
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const anaRes = await api.get('/companies/analytics');
        setAnalytics(anaRes.data);

        const jobsRes = await api.get('/companies/jobs');
        setJobs(jobsRes.data || []);
      } catch (error) {
        console.error('Error fetching company dashboard:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Configure Chart JS data
  const getChartData = () => {
    if (!analytics || !analytics.breakdown) return null;
    const { applied, viewed, shortlisted, interview, hired, rejected } = analytics.breakdown;
    
    return {
      labels: ['Applied', 'Viewed', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'],
      datasets: [
        {
          label: 'Candidates count',
          data: [applied, viewed, shortlisted, interview, hired, rejected],
          backgroundColor: [
            'rgba(37, 99, 235, 0.75)', // primary blue
            'rgba(6, 182, 212, 0.75)',  // accent cyan
            'rgba(245, 158, 11, 0.75)', // amber
            'rgba(139, 92, 246, 0.75)', // purple
            'rgba(16, 185, 129, 0.75)', // emerald
            'rgba(244, 63, 94, 0.75)'   // rose
          ],
          borderRadius: 8
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { padding: 10 }
    },
    scales: {
      y: {
        grid: { color: 'rgba(200, 200, 200, 0.05)' },
        ticks: { precision: 0 }
      },
      x: { grid: { display: false } }
    }
  };

  const chartData = getChartData();

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
      
      {/* Recruiter Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Recruiter Command Hub</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage vacancies, verify candidate applications, and review pipeline statistics.
          </p>
        </div>
        <Link
          to="/company/post-job"
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/20 transition duration-300 flex items-center gap-1.5"
        >
          <FiPlusCircle /> Post New Job
        </Link>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(x => <div key={x} className="h-28 rounded-2xl glass shimmer"></div>)}
          </div>
          <div className="h-96 rounded-3xl glass shimmer"></div>
        </div>
      ) : (
        <>
          {/* Analytics telemetry cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-455 text-[10px] font-bold uppercase tracking-wider block">Total Postings</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 text-slate-900 dark:text-white">
                {analytics?.totalJobs || 0}
              </h3>
            </div>

            <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-455 text-[10px] font-bold uppercase tracking-wider block">Active Jobs</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 text-emerald-500">
                {analytics?.activeJobs || 0}
              </h3>
            </div>

            <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-455 text-[10px] font-bold uppercase tracking-wider block">Pending Approval</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 text-amber-500">
                {analytics?.pendingJobs || 0}
              </h3>
            </div>

            <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-455 text-[10px] font-bold uppercase tracking-wider block">Total Applicants</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 text-primary">
                {analytics?.totalApplicants || 0}
              </h3>
            </div>

          </div>

          {/* Pipelines & Listings summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Chart pipeline */}
            <div className="lg:col-span-2 glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
              <h3 className="font-extrabold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                Candidate Pipeline
              </h3>
              
              <div className="h-64 relative">
                {chartData ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                    No pipeline metrics to display.
                  </div>
                )}
              </div>
            </div>

            {/* Jobs summary status sidebar list */}
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm">Listing Status</h3>
                <Link to="/company/manage-jobs" className="text-xs font-semibold text-primary hover:underline">
                  Manage
                </Link>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No posted jobs.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-850 max-h-64 overflow-y-auto pr-1">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job._id} className="py-2.5 flex justify-between items-center text-xs gap-3">
                      <div className="overflow-hidden">
                        <p className="font-bold truncate">{job.title}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{job.jobCategory}</p>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        job.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : job.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default CompanyDashboard;
