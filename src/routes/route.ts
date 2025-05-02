import { Router } from 'express';
import { authRoutes } from '../modules/auth/authRoute';
import { categoryRoutes } from '../modules/category/categoryRoute';
import { reviewRoutes } from '../modules/review/reviewRoute';
import { userRoutes } from '../modules/user/userRoute';
import { PaymentRoutes } from '../modules/payment/payment.route';

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
    {
        path: '/reviews',
        route: reviewRoutes,
    },
    {
        path: '/payment',
        route: PaymentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
