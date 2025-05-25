import { Router } from 'express';
import auth from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { voteController } from './voteController';
import { voteValidation } from './voteValidation';
import { User_Role } from '../../../generated/prisma';

const router = Router();

router.post(
    '/:reviewId',
    auth(User_Role.USER, User_Role.ADMIN),
    validate(voteValidation.voteSchema),
    voteController.voteOnReview,
);

export const voteRoutes = router;
