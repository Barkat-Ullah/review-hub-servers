import { Router } from 'express';
import { authRoutes } from '../modules/auth/authRoute';
import { categoryRoutes } from '../modules/category/categoryRoute';
import { userRoutes } from '../modules/user/userRoute';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/users',
        route: userRoutes,
    },
    {
        path: '/categories',
        route: categoryRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
