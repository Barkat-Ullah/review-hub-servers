import express from 'express';
import { adminController } from './admin.controller';

const router = express.Router();

router.get('/', adminController.getDashboardOverview);
router.get('/popular-premium-reviews', adminController.getPopularPremiumReviews);
export const AdminRoutes = router;
