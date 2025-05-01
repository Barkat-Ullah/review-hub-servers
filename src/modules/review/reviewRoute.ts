import { Router } from 'express';
import { upload } from '../../middlewares/multer';
import { validate } from '../../middlewares/validate';
import { reviewController } from './reviewController';
import { reviewValidation } from './reviewValidation';

const router = Router();

router.post(
    '/',
    upload.array('imageUrls'),
    validate(reviewValidation.createReviewValidation),
    reviewController.createReviewForUser,
);
router.get('/', reviewController.getAllReviews);

export const reviewRoutes = router;
