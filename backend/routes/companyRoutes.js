import express from 'express';
import { 
  getCompanyProfile,
  updateCompanyProfile,
  addJob,
  getMyPostedJobs,
  editJob,
  deleteJob,
  closeJob,
  reopenJob,
  getApplicantsForJobs,
  updateApplicantStatus,
  getCompanyAnalytics,
  exportApplicants
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect & authorize to all routes
router.use(protect);
router.use(authorize('company'));

router.get('/profile', getCompanyProfile);
router.put('/profile', updateCompanyProfile);
router.post('/jobs', addJob);
router.get('/jobs', getMyPostedJobs);
router.put('/jobs/:id', editJob);
router.delete('/jobs/:id', deleteJob);
router.put('/jobs/:id/close', closeJob);
router.put('/jobs/:id/reopen', reopenJob);
router.get('/applicants', getApplicantsForJobs);
router.put('/applications/:id', updateApplicantStatus);
router.get('/analytics', getCompanyAnalytics);
router.get('/export-applicants', exportApplicants);

export default router;
