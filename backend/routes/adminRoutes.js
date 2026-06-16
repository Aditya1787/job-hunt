import express from 'express';
import { 
  getAdminAnalytics,
  getUsers,
  toggleUserStatus,
  deleteUser,
  getCompanies,
  updateCompanyStatus,
  getPendingJobs,
  verifyJob,
  getReports,
  resolveReport
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect & authorize to all routes
router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/toggle-block', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/companies', getCompanies);
router.put('/companies/:id/status', updateCompanyStatus);
router.get('/jobs/approvals', getPendingJobs);
router.put('/jobs/:id/verify', verifyJob);
router.get('/reports', getReports);
router.put('/reports/:id/resolve', resolveReport);

export default router;
