import User from '../models/User.js';
import Job from '../models/Job.js';
import { recommendJobsForCandidate, getSearchSuggestions } from '../utils/aiRecommender.js';

// @desc    Get recommended jobs for candidate based on profile match
// @route   GET /api/ai/recommendations
// @access  Private (Candidate)
export const getRecommendations = async (req, res) => {
  try {
    const candidate = await User.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate user not found' });
    }

    if (candidate.role !== 'candidate') {
      return res.status(400).json({ message: 'Recommendations are only available for candidate accounts' });
    }

    // Fetch all approved and active jobs
    const jobs = await Job.find({ status: 'approved' })
      .populate('company', 'companyName logo headquarters industry');

    // Run recommendation algorithm
    const recommendations = recommendJobsForCandidate(candidate, jobs);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get smart search autocomplete suggestions
// @route   GET /api/ai/suggestions
// @access  Public
export const getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const jobs = await Job.find({ status: 'approved' }).populate('company', 'companyName');
    const suggestions = getSearchSuggestions(q, jobs);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
