import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { extractSkillsFromPDF } from '../utils/resumeParser.js';
import fs from 'fs';
import path from 'path';

// @desc    Update candidate profile
// @route   PUT /api/candidates/profile
// @access  Private (Candidate)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { 
      phone, 
      location, 
      bio, 
      skills, 
      experience, 
      education, 
      projects, 
      certifications, 
      socialLinks 
    } = req.body;

    // Update profile fields
    if (phone !== undefined) user.candidateProfile.phone = phone;
    if (location !== undefined) user.candidateProfile.location = location;
    if (bio !== undefined) user.candidateProfile.bio = bio;
    if (skills !== undefined) user.candidateProfile.skills = skills;
    if (experience !== undefined) user.candidateProfile.experience = experience;
    if (education !== undefined) user.candidateProfile.education = education;
    if (projects !== undefined) user.candidateProfile.projects = projects;
    if (certifications !== undefined) user.candidateProfile.certifications = certifications;
    if (socialLinks !== undefined) user.candidateProfile.socialLinks = socialLinks;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload resume PDF & extract skills
// @route   POST /api/candidates/upload-resume
// @access  Private (Candidate)
export const uploadResumeFile = (req, res) => {
  uploadResume(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Store relative file path
      const filePath = req.file.path.replace(/\\/g, '/');
      const relativePath = '/' + filePath.split('/').slice(1).join('/');

      user.candidateProfile.resumeUrl = relativePath;

      // Extract skills from uploaded PDF file
      const extractedSkills = await extractSkillsFromPDF(req.file.path);

      // Merge and remove duplicates
      const currentSkills = user.candidateProfile.skills || [];
      const uniqueSkills = Array.from(new Set([...currentSkills, ...extractedSkills]));
      user.candidateProfile.skills = uniqueSkills;

      // Store resumeText
      user.candidateProfile.resumeText = `Uploaded Resume: ${req.file.originalname}. Skills: ${extractedSkills.join(', ')}`;

      await user.save();

      res.json({
        message: 'Resume uploaded and skills extracted successfully!',
        resumeUrl: relativePath,
        extractedSkills,
        skills: user.candidateProfile.skills,
        user
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// @desc    Save a job
// @route   POST /api/candidates/save-job/:jobId
// @access  Private (Candidate)
export const saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const job = await Job.findById(req.params.jobId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (user.candidateProfile.savedJobs.includes(job._id)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    user.candidateProfile.savedJobs.push(job._id);
    await user.save();

    res.json({ message: 'Job saved successfully', savedJobs: user.candidateProfile.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsave a job
// @route   DELETE /api/candidates/save-job/:jobId
// @access  Private (Candidate)
export const unsaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.candidateProfile.savedJobs = user.candidateProfile.savedJobs.filter(
      id => id.toString() !== req.params.jobId
    );
    await user.save();

    res.json({ message: 'Job unsaved successfully', savedJobs: user.candidateProfile.savedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all saved jobs for current user
// @route   GET /api/candidates/saved-jobs
// @access  Private (Candidate)
export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'candidateProfile.savedJobs',
      populate: { path: 'company', select: 'companyName logo headquarters' }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.candidateProfile.savedJobs || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get candidate applications list
// @route   GET /api/candidates/applications
// @access  Private (Candidate)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'companyName logo website industry' }
      })
      .sort('-createdAt');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
