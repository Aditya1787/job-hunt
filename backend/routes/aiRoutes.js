import express from 'express';
import { getRecommendations, getSuggestions } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/recommendations', protect, authorize('candidate'), getRecommendations);
router.get('/suggestions', getSuggestions);

export default router;
