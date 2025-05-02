import { Router } from 'express';
import { categoryRoutes } from '../modules/category/categoryRoute';
import { reviewRoutes } from '../modules/review/reviewRoute';
import { userRoutes } from '../modules/user/userRoute';
import { AuthRoutes } from '../modules/auth/authRoute';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/users',
        route: userRoutes,
    },
    {
        path: '/categories',
        route: categoryRoutes,
    },
    {
        path: '/reviews',
        route: reviewRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
