import express from 'express';
import { 
  getJobs, 
  getJobById, 
  applyJob, 
  reportJob 
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/:id/apply', protect, authorize('candidate'), applyJob);
router.post('/:id/report', protect, reportJob);

export default router;
