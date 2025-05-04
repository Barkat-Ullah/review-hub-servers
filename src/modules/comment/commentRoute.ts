import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { commentController } from './commentController';
import { commentValidation } from './commentValidation';

const router = Router();

router.post(
    '/',
    validate(commentValidation.createComment),
    commentController.createComment,
);

router.get('/:reviewId', commentController.getCommentsByReviewId);

export const commentRoutes = router;
