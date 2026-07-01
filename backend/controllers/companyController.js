import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { uploadLogo } from '../middleware/uploadMiddleware.js';
import { jsonToCSV } from '../utils/dataExporter.js';
import { io, onlineUsers } from '../server.js';

// @desc    Get recruiter company profile
// @route   GET /api/companies/profile
// @access  Private (Company)
export const getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update company profile (includes logo file upload)
// @route   PUT /api/companies/profile
// @access  Private (Company)
export const updateCompanyProfile = (req, res) => {
  uploadLogo(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const company = await Company.findOne({ owner: req.user._id });
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      const { companyName, website, description, companySize, industry, headquarters, socialLinks } = req.body;

      if (companyName) company.companyName = companyName;
      if (website !== undefined) company.website = website;
      if (description !== undefined) company.description = description;
      if (companySize !== undefined) company.companySize = companySize;
      if (industry !== undefined) company.industry = industry;
      if (headquarters !== undefined) company.headquarters = headquarters;
      if (socialLinks !== undefined) {
        const parsedSocial = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
        company.socialLinks = parsedSocial;
      }

      if (req.file) {
        const filePath = req.file.path.replace(/\\/g, '/');
        const relativePath = '/' + filePath.split('/').slice(1).join('/');
        company.logo = relativePath;
      }

      await company.save();

      // Sync company name inside User profile
      const user = await User.findById(req.user._id);
      if (user) {
        user.companyProfile.companyName = company.companyName;
        if (company.logo) user.profilePhoto = company.logo;
        await user.save();
      }

      res.json({
        message: 'Company profile updated successfully',
        company,
        user
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// @desc    Add a new job (Status pending by default)
// @route   POST /api/companies/jobs
// @access  Private (Company)
export const addJob = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      skillsRequired, 
      salaryMin, 
      salaryMax, 
      experience, 
      location, 
      employmentType, 
      jobCategory, 
      openings, 
      deadline, 
      remoteType, 
      benefits 
    } = req.body;

    const company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      return res.status(400).json({ message: 'Recruiter must set up a company profile before posting jobs' });
    }

    // Auto-approve company if still pending so recruiters can post immediately
    if (company.verificationStatus === 'pending') {
      company.verificationStatus = 'approved';
      await company.save();
    }

    if (company.verificationStatus === 'rejected' || company.verificationStatus === 'suspended') {
      return res.status(403).json({ 
        message: 'Your company account has been suspended or rejected. Please contact support.' 
      });
    }

    const job = await Job.create({
      title,
      description,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(s => s.trim()),
      salary: {
        min: parseInt(salaryMin),
        max: parseInt(salaryMax)
      },
      experience: parseInt(experience),
      location,
      employmentType,
      jobCategory,
      openings: parseInt(openings) || 1,
      deadline: new Date(deadline),
      remoteType,
      benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split(',').map(b => b.trim()) : []),
      status: 'approved', // Auto-approved on creation
      company: company._id,
      postedBy: req.user._id
    });

    res.status(201).json({
      message: 'Job posted successfully!',
      job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recruiter posted jobs
// @route   GET /api/companies/jobs
// @access  Private (Company)
export const getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort('-createdAt');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Edit job details
// @route   PUT /api/companies/jobs/:id
// @access  Private (Company)
export const editJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized. Not your job posting.' });
    }

    const { 
      title, 
      description, 
      skillsRequired, 
      salaryMin, 
      salaryMax, 
      experience, 
      location, 
      employmentType, 
      jobCategory, 
      openings, 
      deadline, 
      remoteType, 
      benefits 
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (skillsRequired) {
      job.skillsRequired = Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(s => s.trim());
    }
    if (salaryMin !== undefined) job.salary.min = parseInt(salaryMin);
    if (salaryMax !== undefined) job.salary.max = parseInt(salaryMax);
    if (experience !== undefined) job.experience = parseInt(experience);
    if (location) job.location = location;
    if (employmentType) job.employmentType = employmentType;
    if (jobCategory) job.jobCategory = jobCategory;
    if (openings) job.openings = parseInt(openings);
    if (deadline) job.deadline = new Date(deadline);
    if (remoteType) job.remoteType = remoteType;
    if (benefits) {
      job.benefits = Array.isArray(benefits) ? benefits : benefits.split(',').map(b => b.trim());
    }

    // Keep job approved after editing so it stays visible to candidates
    job.status = 'approved';

    await job.save();
    res.json({ message: 'Job updated and resubmitted for admin approval.', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/companies/jobs/:id
// @access  Private (Company)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Remove applications for this job
    await Application.deleteMany({ job: job._id });
    // Remove job posting
    await Job.findByIdAndDelete(job._id);

    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Close a job posting
// @route   PUT /api/companies/jobs/:id/close
// @access  Private (Company)
export const closeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    job.status = 'closed';
    await job.save();

    res.json({ message: 'Job closed successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reopen a closed job posting (goes back to pending approval)
// @route   PUT /api/companies/jobs/:id/reopen
// @access  Private (Company)
export const reopenJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    job.status = 'approved';
    await job.save();

    res.json({ message: 'Job reopened successfully.', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get candidates list for company's posted jobs
// @route   GET /api/companies/applicants
// @access  Private (Company)
export const getApplicantsForJobs = async (req, res) => {
  try {
    const { status, search } = req.query;

    const myJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = myJobs.map(j => j._id);

    const query = { job: { $in: jobIds } };

    if (status) {
      query.status = status;
    }

    let applications = await Application.find(query)
      .populate('job', 'title location experience remoteType')
      .populate('candidate', 'name email candidateProfile.skills candidateProfile.location candidateProfile.phone candidateProfile.experience candidateProfile.education candidateProfile.resumeUrl')
      .sort('-createdAt');

    // Filter by candidate name if search is provided
    if (search) {
      const searchLower = search.toLowerCase();
      applications = applications.filter(app => 
        app.candidate && app.candidate.name.toLowerCase().includes(searchLower)
      );
    }

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status (shortlist, reject, interview, hired)
// @route   PUT /api/companies/applications/:id
// @access  Private (Company)
export const updateApplicantStatus = async (req, res) => {
  const { status, interviewDate, interviewDetails } = req.body;

  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title postedBy')
      .populate('candidate', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    application.status = status;

    if (status === 'interview') {
      if (interviewDate) application.interviewDate = new Date(interviewDate);
      if (interviewDetails) application.interviewDetails = interviewDetails;
    }

    await application.save();

    // Create Notification for candidate
    let notificationMsg = `Your application for ${application.job.title} was updated to: ${status}.`;
    if (status === 'interview' && interviewDate) {
      notificationMsg = `Interview scheduled for ${application.job.title} on ${new Date(interviewDate).toLocaleDateString()}.`;
    }

    const notification = await Notification.create({
      recipient: application.candidate._id,
      sender: req.user._id,
      type: status === 'interview' ? 'interview' : 'application_status',
      message: notificationMsg,
      link: '/candidate/applications'
    });

    const candSocketId = onlineUsers.get(application.candidate._id.toString());
    if (candSocketId) {
      io.to(candSocketId).emit('notification_received', notification);
    }

    res.json({ message: `Applicant status updated to ${status} successfully.`, application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Recruiter Company analytics dashboard data
// @route   GET /api/companies/analytics
// @access  Private (Company)
export const getCompanyAnalytics = async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id });
    const jobIds = myJobs.map(j => j._id);

    const activeJobs = myJobs.filter(j => j.status === 'approved').length;
    const pendingJobs = myJobs.filter(j => j.status === 'pending').length;
    const closedJobs = myJobs.filter(j => j.status === 'closed').length;

    const applications = await Application.find({ job: { $in: jobIds } });
    const totalApplicants = applications.length;

    // Status breakdown
    const breakdown = {
      applied: applications.filter(a => a.status === 'applied').length,
      viewed: applications.filter(a => a.status === 'viewed').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      interview: applications.filter(a => a.status === 'interview').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      hired: applications.filter(a => a.status === 'hired').length
    };

    res.json({
      totalJobs: myJobs.length,
      activeJobs,
      pendingJobs,
      closedJobs,
      totalApplicants,
      breakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export Applicants to CSV
// @route   GET /api/companies/export-applicants
// @access  Private (Company)
export const exportApplicants = async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = myJobs.map(j => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title location')
      .populate('candidate', 'name email candidateProfile.phone candidateProfile.location candidateProfile.skills');

    if (applications.length === 0) {
      return res.status(404).json({ message: 'No applicants found to export' });
    }

    const flatData = applications.map(app => ({
      applicant_name: app.candidate?.name || 'N/A',
      applicant_email: app.candidate?.email || 'N/A',
      phone: app.candidate?.candidateProfile?.phone || 'N/A',
      location: app.candidate?.candidateProfile?.location || 'N/A',
      skills: (app.candidate?.candidateProfile?.skills || []).join(' | '),
      job_title: app.job?.title || 'N/A',
      job_location: app.job?.location || 'N/A',
      application_status: app.status,
      applied_at: app.createdAt
    }));

    const fields = ['applicant_name', 'applicant_email', 'phone', 'location', 'skills', 'job_title', 'job_location', 'application_status', 'applied_at'];
    const csvContent = jsonToCSV(flatData, fields);

    res.header('Content-Type', 'text/csv');
    res.attachment('applicants-list.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
