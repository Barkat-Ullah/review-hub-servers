import { Router } from 'express';
import { User_Role } from '../../../prisma/generated/prisma-client';
import auth from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { categoryController } from './categoryController';
import { categoryValidation } from './categoryValidation';

const router = Router();

router.post(
    '/',
    auth(User_Role.ADMIN),
    validate(categoryValidation.createValidation),
    categoryController.createCategory,
);
router.get('/', categoryController.getAllCategories);
router.get(
    '/admin',
    auth(User_Role.ADMIN),
    categoryController.getCategoriesForAdmin,
);

export const categoryRoutes = router;
