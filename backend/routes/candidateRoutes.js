import express from 'express';
import { 
  updateProfile, 
  uploadResumeFile, 
  saveJob, 
  unsaveJob, 
  getSavedJobs, 
  getMyApplications 
} from '../controllers/candidateController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, authorize('candidate'), updateProfile);
router.post('/upload-resume', protect, authorize('candidate'), uploadResumeFile);
router.post('/save-job/:jobId', protect, authorize('candidate'), saveJob);
router.delete('/save-job/:jobId', protect, authorize('candidate'), unsaveJob);
router.get('/saved-jobs', protect, authorize('candidate'), getSavedJobs);
router.get('/applications', protect, authorize('candidate'), getMyApplications);

export default router;
