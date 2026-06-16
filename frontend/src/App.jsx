import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

// Common Layout components
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';

// Public Pages
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import FAQ from './pages/public/FAQ.jsx';
import Contact from './pages/public/Contact.jsx';
import Privacy from './pages/public/Privacy.jsx';
import Terms from './pages/public/Terms.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard.jsx';
import Jobs from './pages/candidate/Jobs.jsx';
import JobDetails from './pages/candidate/JobDetails.jsx';
import CandidateProfile from './pages/candidate/Profile.jsx';
import CandidateApplications from './pages/candidate/Applications.jsx';
import CandidateSettings from './pages/candidate/Settings.jsx';

// Recruiter Pages
import CompanyDashboard from './pages/company/Dashboard.jsx';
import PostJob from './pages/company/PostJob.jsx';
import ManageJobs from './pages/company/ManageJobs.jsx';
import Applicants from './pages/company/Applicants.jsx';
import CompanyProfile from './pages/company/Profile.jsx';
import CompanySettings from './pages/company/Settings.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import AdminCompanies from './pages/admin/Companies.jsx';
import AdminJobsApproval from './pages/admin/JobsApproval.jsx';
import AdminReports from './pages/admin/Reports.jsx';
import AdminSettings from './pages/admin/Settings.jsx';

// Shared Pages
import Chat from './pages/Chat.jsx';

// Layout Wrapper
const PageLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

// Auth Route Protections
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <span className="text-sm font-semibold text-slate-400">Verifying session...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <ThemeProvider>
              <Routes>
                
                {/* Public Routes */}
                <Route path="/" element={<PageLayout><Home /></PageLayout>} />
                <Route path="/about" element={<PageLayout><About /></PageLayout>} />
                <Route path="/faq" element={<PageLayout><FAQ /></PageLayout>} />
                <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
                <Route path="/privacy-policy" element={<PageLayout><Privacy /></PageLayout>} />
                <Route path="/terms-conditions" element={<PageLayout><Terms /></PageLayout>} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Candidate Protected Routes */}
                <Route path="/candidate/dashboard" element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <PageLayout><CandidateDashboard /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/jobs" element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <PageLayout><Jobs /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/jobs/:id" element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <PageLayout><JobDetails /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/candidate/profile" element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <PageLayout><CandidateProfile /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/candidate/applications" element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <PageLayout><CandidateApplications /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/candidate/messages" element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <PageLayout><Chat /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/candidate/settings" element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <PageLayout><CandidateSettings /></PageLayout>
                  </ProtectedRoute>
                } />

                {/* Company Protected Routes */}
                <Route path="/company/dashboard" element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <PageLayout><CompanyDashboard /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/company/post-job" element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <PageLayout><PostJob /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/company/manage-jobs" element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <PageLayout><ManageJobs /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/company/applicants" element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <PageLayout><Applicants /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/company/profile" element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <PageLayout><CompanyProfile /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/company/messages" element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <PageLayout><Chat /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/company/settings" element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <PageLayout><CompanySettings /></PageLayout>
                  </ProtectedRoute>
                } />

                {/* Admin Protected Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PageLayout><AdminDashboard /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PageLayout><AdminUsers /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/companies" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PageLayout><AdminCompanies /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/jobs-approval" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PageLayout><AdminJobsApproval /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PageLayout><AdminReports /></PageLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PageLayout><AdminSettings /></PageLayout>
                  </ProtectedRoute>
                } />

                {/* Fallback Catch */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </ThemeProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
