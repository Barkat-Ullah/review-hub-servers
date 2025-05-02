import { Router } from 'express';
import { categoryRoutes } from '../modules/category/categoryRoute';
import { reviewRoutes } from '../modules/review/reviewRoute';
import { userRoutes } from '../modules/user/userRoute';
import { AuthRoutes } from '../modules/auth/authRoute';
import { AdminRoutes } from '../modules/admin/admin.routes';

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
    {
        path: '/admin/dashboard-overview',
        route: AdminRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
