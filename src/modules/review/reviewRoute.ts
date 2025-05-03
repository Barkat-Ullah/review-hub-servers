import { Router } from 'express';
import { User_Role } from '../../../prisma/generated/prisma-client';
import auth from '../../middlewares/auth';
import { upload } from '../../middlewares/multer';
import { validate } from '../../middlewares/validate';
import { reviewController } from './reviewController';
import { reviewValidation } from './reviewValidation';

const router = Router();

router.post(
    '/',
    auth(User_Role.USER, User_Role.ADMIN),
    upload.array('imageUrls'),
    validate(reviewValidation.createReviewValidation),
    reviewController.createReviewForUser,
);
router.get('/', reviewController.getAllReviews);
router.put(
    '/:reviewId',
    upload.array('imageUrls'),
    auth(User_Role.USER, User_Role.ADMIN),
    validate(reviewValidation.updateReview),
);

export const reviewRoutes = router;
