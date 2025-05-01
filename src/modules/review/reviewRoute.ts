import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { reviewController } from './reviewController';
import { reviewValidation } from './reviewValidation';

const router = Router();

router.post(
    '/',
    validate(reviewValidation.createReviewValidation),
    reviewController.createReviewForUser,
);
router.get('/', reviewController.getAllReviews);

export const reviewRoutes = router;
