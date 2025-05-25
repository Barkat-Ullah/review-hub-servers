import { Router } from 'express';

import auth from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { commentController } from './commentController';
import { commentValidation } from './commentValidation';
import { User_Role } from '../../../generated/prisma';

const router = Router();

router.post(
    '/',
    auth(User_Role.ADMIN, User_Role.USER),
    validate(commentValidation.createComment),
    commentController.createComment,
);

router.get('/:reviewId', commentController.getCommentsByReviewId);

export const commentRoutes = router;
