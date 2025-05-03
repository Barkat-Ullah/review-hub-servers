import { Router } from 'express';
import { User_Role } from '../../../prisma/generated/prisma-client';
import auth from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { voteController } from './voteController';
import { voteValidation } from './voteValidation';

const router = Router();

router.post(
    '/:reviewId',
    auth(User_Role.USER, User_Role.ADMIN),
    validate(voteValidation.voteSchema),
    voteController.voteOnReview,
);

export const voteRoutes = router;
