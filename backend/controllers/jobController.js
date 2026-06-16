import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import Company from '../models/Company.js';
import Report from '../models/Report.js';
import User from '../models/User.js';
import { io, onlineUsers } from '../server.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

// @desc    Get all jobs (Approved only) with search, filters, sorting & pagination
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { 
      search, 
      location, 
      remoteType, 
      employmentType, 
      experience, 
      minSalary, 
      category,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    // Base query
    const query = { status: 'approved' };

    // Search term matching (Title, Description, Skills)
    if (search) {
      const regex = new RegExp(search, 'i');
      // We also want to support searching by company name. 
      // First we find companies matching search term
      const matchingCompanies = await Company.find({ companyName: regex }).select('_id');
      const companyIds = matchingCompanies.map(c => c._id);

      query.$or = [
        { title: regex },
        { description: regex },
        { skillsRequired: { $in: [regex] } },
        { jobCategory: regex },
        { company: { $in: companyIds } }
      ];
    }

    // Filter by location
    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Filter by remote type
    if (remoteType) {
      query.remoteType = remoteType;
    }

    // Filter by employment type
    if (employmentType) {
      query.employmentType = employmentType;
    }

    // Filter by experience level (max years required)
    if (experience) {
      query.experience = { $lte: parseInt(experience) };
    }

    // Filter by min salary
    if (minSalary) {
      query['salary.min'] = { $gte: parseInt(minSalary) };
    }

    // Filter by category
    if (category) {
      query.jobCategory = new RegExp(category, 'i');
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'salary_desc') {
      sortOption = { 'salary.max': -1 };
    } else if (sort === 'salary_asc') {
      sortOption = { 'salary.min': 1 };
    } else if (sort === 'experience_asc') {
      sortOption = { experience: 1 };
    } else if (sort === 'deadline_asc') {
      sortOption = { deadline: 1 };
    }

    const jobs = await Job.find(query)
      .populate('company', 'companyName logo headquarters industry')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limitNum);

    res.json({
      jobs,
      totalJobs,
      totalPages,
      currentPage: pageNum
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'companyName logo website description companySize industry headquarters socialLinks')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Candidate)
export const applyJob = (req, res) => {
  // Wrap in uploadResume in case candidate uploads a new custom resume for this application
  uploadResume(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const jobId = req.params.id;
      const candidateId = req.user._id;

      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      if (job.status !== 'approved') {
        return res.status(400).json({ message: 'Applications are closed for this job' });
      }

      // Check if candidate already applied
      const alreadyApplied = await Application.findOne({ candidate: candidateId, job: jobId });
      if (alreadyApplied) {
        return res.status(400).json({ message: 'You have already applied for this job' });
      }

      let resumeUrl = '';
      if (req.file) {
        // Store uploaded file
        const filePath = req.file.path.replace(/\\/g, '/');
        resumeUrl = '/' + filePath.split('/').slice(1).join('/');
      } else {
        // Use existing profile resume
        const candidateUser = await User.findById(candidateId);
        if (!candidateUser || !candidateUser.candidateProfile.resumeUrl) {
          return res.status(400).json({ message: 'Please upload a resume or add it to your profile first' });
        }
        resumeUrl = candidateUser.candidateProfile.resumeUrl;
      }

      const { coverLetter } = req.body;

      const application = await Application.create({
        candidate: candidateId,
        job: jobId,
        resume: resumeUrl,
        coverLetter: coverLetter || '',
        status: 'applied'
      });

      // Send Real-time notification to Company Owner
      const companyUser = job.postedBy;
      const notificationText = `${req.user.name} applied for your job: ${job.title}`;
      
      const notification = await Notification.create({
        recipient: companyUser,
        sender: candidateId,
        type: 'application_status',
        message: notificationText,
        link: '/company/applicants' // Recruiter side view link
      });

      const recSocketId = onlineUsers.get(companyUser.toString());
      if (recSocketId) {
        io.to(recSocketId).emit('notification_received', notification);
      }

      res.status(201).json({
        message: 'Applied successfully!',
        application
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// @desc    Report a job
// @route   POST /api/jobs/:id/report
// @access  Private
export const reportJob = async (req, res) => {
  const { type, description } = req.body;

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      job: job._id,
      type,
      description,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Job reported successfully. Our admins will investigate.',
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
