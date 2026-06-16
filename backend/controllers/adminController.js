import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import Report from '../models/Report.js';
import { io, onlineUsers } from '../server.js';

// @desc    Get Admin dashboard analytics telemetry
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const pendingJobs = await Job.countDocuments({ status: 'pending' });
    const pendingCompanies = await Company.countDocuments({ verificationStatus: 'pending' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    // Job Status Breakdown
    const jobBreakdown = {
      pending: pendingJobs,
      approved: await Job.countDocuments({ status: 'approved' }),
      rejected: await Job.countDocuments({ status: 'rejected' }),
      closed: await Job.countDocuments({ status: 'closed' })
    };

    // User Role Breakdown
    const userBreakdown = {
      candidate: await User.countDocuments({ role: 'candidate' }),
      company: await User.countDocuments({ role: 'company' }),
      admin: await User.countDocuments({ role: 'admin' })
    };

    // Revenue Metrics (Mock calculation - $10 per approved job as base fee + $50 per premium application)
    const revenue = (jobBreakdown.approved * 15) + (totalApplications * 5);

    res.json({
      metrics: {
        totalUsers,
        totalCompanies,
        totalJobs,
        totalApplications,
        pendingJobs,
        pendingCompanies,
        pendingReports,
        revenue
      },
      jobBreakdown,
      userBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with search & filters
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 15 } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { email: regex }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limitNum);

    res.json({
      users,
      totalUsers,
      totalPages,
      currentPage: pageNum
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle block/unblock status of a user
// @route   PUT /api/admin/users/:id/toggle-block
// @access  Private (Admin)
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block administrative accounts' });
    }

    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();

    // If company, block jobs too or suspend company
    if (user.role === 'company') {
      const company = await Company.findOne({ owner: user._id });
      if (company) {
        company.verificationStatus = user.status === 'blocked' ? 'suspended' : 'approved';
        await company.save();
      }
    }

    // Terminate socket connection if blocked and online
    const socketId = onlineUsers.get(user._id.toString());
    if (socketId && user.status === 'blocked') {
      io.to(socketId).emit('blocked'); // tell client they are blocked
    }

    res.json({ message: `User account is now ${user.status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin accounts' });
    }

    if (user.role === 'company') {
      const company = await Company.findOne({ owner: user._id });
      if (company) {
        // Delete posted jobs
        await Job.deleteMany({ company: company._id });
        await Company.findByIdAndDelete(company._id);
      }
    } else if (user.role === 'candidate') {
      // Delete candidate's applications
      await Application.deleteMany({ candidate: user._id });
    }

    await User.findByIdAndDelete(user._id);
    res.json({ message: 'User account and associated records deleted permanently' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get list of companies with status filter
// @route   GET /api/admin/companies
// @access  Private (Admin)
export const getCompanies = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) {
      query.verificationStatus = status;
    }

    if (search) {
      query.companyName = new RegExp(search, 'i');
    }

    const companies = await Company.find(query).populate('owner', 'name email').sort('-createdAt');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve / Reject / Suspend corporate company accounts
// @route   PUT /api/admin/companies/:id/status
// @access  Private (Admin)
export const updateCompanyStatus = async (req, res) => {
  const { status } = req.body; // approved, rejected, suspended

  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company record not found' });
    }

    company.verificationStatus = status;
    await company.save();

    // Notify company owner
    const notification = await Notification.create({
      recipient: company.owner,
      type: 'job_approval',
      message: `Your company profile "${company.companyName}" verification status was updated to: ${status}.`,
      link: '/company/profile'
    });

    const ownerSocket = onlineUsers.get(company.owner.toString());
    if (ownerSocket) {
      io.to(ownerSocket).emit('notification_received', notification);
    }

    res.json({ message: `Company status updated to ${status} successfully.`, company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs requiring verification (Pending jobs)
// @route   GET /api/admin/jobs/approvals
// @access  Private (Admin)
export const getPendingJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'pending' })
      .populate('company', 'companyName logo verificationStatus industry headquarters')
      .populate('postedBy', 'name email')
      .sort('createdAt');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve / Reject job postings
// @route   PUT /api/admin/jobs/:id/verify
// @access  Private (Admin)
export const verifyJob = async (req, res) => {
  const { status, rejectionReason } = req.body; // approved, rejected

  try {
    const job = await Job.findById(req.params.id).populate('company', 'companyName');
    if (!job) {
      return res.status(404).json({ message: 'Job listing not found' });
    }

    job.status = status;
    if (status === 'rejected' && rejectionReason) {
      job.rejectionReason = rejectionReason;
    } else {
      job.rejectionReason = '';
    }

    await job.save();

    // Create notification alert for company poster
    const messageText = status === 'approved' 
      ? `Your job listing "${job.title}" has been approved and is now live!`
      : `Your job listing "${job.title}" was rejected. Reason: ${rejectionReason || 'Details mismatch'}`;

    const notification = await Notification.create({
      recipient: job.postedBy,
      type: 'job_approval',
      message: messageText,
      link: '/company/jobs'
    });

    const recruiterSocket = onlineUsers.get(job.postedBy.toString());
    if (recruiterSocket) {
      io.to(recruiterSocket).emit('notification_received', notification);
    }

    res.json({ message: `Job is now marked as ${status}`, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaints/spam reports list
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name email')
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'companyName' }
      })
      .sort('-createdAt');

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve a job report
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private (Admin)
export const resolveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report log not found' });
    }

    report.status = 'resolved';
    await report.save();

    res.json({ message: 'Report marked as resolved successfully', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
