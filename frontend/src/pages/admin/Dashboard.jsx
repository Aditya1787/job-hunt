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
import { 
  FiUsers, 
  FiBriefcase, 
  FiTrendingUp, 
  FiAlertTriangle, 
  FiSliders, 
  FiDollarSign, 
  FiCheckSquare,
  FiZap 
} from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch administrator metrics on load
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/admin/analytics');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching admin data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const getChartData = () => {
    if (!data) return null;
    const { candidate, company, admin } = data.userBreakdown;
    
    return {
      labels: ['Candidates', 'Recruiters', 'Administrators'],
      datasets: [
        {
          label: 'Platform Users Count',
          data: [candidate, company, admin],
          backgroundColor: [
            'rgba(16, 185, 129, 0.75)', // primary emerald
            'rgba(13, 148, 136, 0.75)',  // accent teal
            'rgba(75, 85, 99, 0.75)'   // secondary slate
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
      legend: { display: false }
    },
    scales: {
      y: { ticks: { precision: 0 } }
    }
  };

  const chartData = getChartData();

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">System Telemetry Console</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor platform users, verify recruiter corporate listings, check vacancy approvals, and resolve spam logs.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(x => <div key={x} className="h-28 rounded-2xl glass shimmer"></div>)}
          </div>
          <div className="h-96 rounded-3xl glass shimmer"></div>
        </div>
      ) : (
        <>
          {/* Metrics grids */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-455 text-[10px] font-bold uppercase tracking-wider block">Total Users</span>
                <h3 className="text-2xl font-extrabold mt-1">{data?.metrics.totalUsers}</h3>
              </div>
              <span className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <FiUsers className="w-5 h-5" />
              </span>
            </div>

            <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-455 text-[10px] font-bold uppercase tracking-wider block">Pending Jobs</span>
                <h3 className="text-2xl font-extrabold mt-1 text-amber-500">{data?.metrics.pendingJobs}</h3>
              </div>
              <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-505">
                <FiClock className="w-5 h-5 animate-pulse" />
              </span>
            </div>

            <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-455 text-[10px] font-bold uppercase tracking-wider block">Pending Companies</span>
                <h3 className="text-2xl font-extrabold mt-1 text-accent">{data?.metrics.pendingCompanies}</h3>
              </div>
              <span className="p-2.5 rounded-xl bg-accent/10 text-accent">
                <FiCheckSquare className="w-5 h-5" />
              </span>
            </div>

            <div className="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-455 text-[10px] font-bold uppercase tracking-wider block">Platform Revenue</span>
                <h3 className="text-2xl font-extrabold mt-1 text-emerald-500">${data?.metrics.revenue}</h3>
              </div>
              <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-505">
                <FiDollarSign className="w-5 h-5" />
              </span>
            </div>

          </div>

          {/* Quick links & demographics charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Demographics Bar Chart */}
            <div className="lg:col-span-2 glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
              <h3 className="font-extrabold text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1">
                <FiTrendingUp /> User Demographics
              </h3>
              <div className="h-64 relative">
                {chartData && <Bar data={chartData} options={chartOptions} />}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-extrabold text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1">
                <FiSliders /> Actions Queue
              </h3>
              
              <div className="flex flex-col gap-3">
                <Link
                  to="/admin/users"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex justify-between items-center text-xs"
                >
                  <span className="font-bold flex items-center gap-2">
                    <FiUsers /> Manage Users
                  </span>
                  <span className="text-slate-400">Manage &rarr;</span>
                </Link>

                <Link
                  to="/admin/companies"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex justify-between items-center text-xs"
                >
                  <span className="font-bold flex items-center gap-2">
                    <FiCheckSquare /> Verify Companies
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-extrabold text-[10px]">
                    {data?.metrics.pendingCompanies} pending
                  </span>
                </Link>

                <Link
                  to="/admin/jobs-approval"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex justify-between items-center text-xs"
                >
                  <span className="font-bold flex items-center gap-2">
                    <FiBriefcase /> Verify Job Openings
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-extrabold text-[10px]">
                    {data?.metrics.pendingJobs} pending
                  </span>
                </Link>

                <Link
                  to="/admin/reports"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition flex justify-between items-center text-xs"
                >
                  <span className="font-bold flex items-center gap-2 text-rose-500">
                    <FiAlertTriangle /> Spam & Complaints
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-extrabold text-[10px]">
                    {data?.metrics.pendingReports} active
                  </span>
                </Link>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default AdminDashboard;
