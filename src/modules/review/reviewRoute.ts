import { Router } from 'express';
import auth from '../../middlewares/auth';
import { upload } from '../../middlewares/multer';
import { validate } from '../../middlewares/validate';
import { reviewController } from './reviewController';
import { reviewValidation } from './reviewValidation';
import { User_Role } from '../../../generated/prisma';

const router = Router();

router.post(
    '/',
    auth(User_Role.USER, User_Role.ADMIN),
    upload.array('imageUrls'),
    validate(reviewValidation.createReviewValidation),
    reviewController.createReviewForUser,
);
router.get('/', reviewController.getAllReviews);
router.get(
    '/admin',
    auth(User_Role.ADMIN),
    reviewController.getAllReviewsForAdmin,
);
router.get('/:reviewId', reviewController.getReviewById);
router.get(
    '/user/:userId',
    auth(User_Role.USER),
    reviewController.getReviewsByUser,
);
router.delete(
    '/:reviewId',
    auth(User_Role.USER, User_Role.ADMIN),
    reviewController.deleteReview,
);
router.put(
    '/:reviewId',
    upload.array('imageUrls'),
    auth(User_Role.USER, User_Role.ADMIN),
    validate(reviewValidation.updateReview),
    reviewController.updateReview,
);
router.patch(
    '/:reviewId/approve',
    auth(User_Role.ADMIN),
    reviewController.approveReview,
);
router.patch(
    '/:reviewId/reject',
    auth(User_Role.ADMIN),
    validate(reviewValidation.rejectReview),
    reviewController.rejectReview,
);

export const reviewRoutes = router;
