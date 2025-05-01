import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { categoryController } from './categoryController';
import { categoryValidation } from './categoryValidation';

const router = Router();

router.post(
    '/',
    validate(categoryValidation.createValidation),
    categoryController.createCategory,
);
router.get('/', categoryController.getAllCategories);
router.get('/admin', categoryController.getCategoriesForAdmin);

export const categoryRoutes = router;
