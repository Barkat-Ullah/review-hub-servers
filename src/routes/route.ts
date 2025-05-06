import { Router } from 'express';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { AuthRoutes } from '../modules/auth/authRoute';
import { categoryRoutes } from '../modules/category/categoryRoute';
import { commentRoutes } from '../modules/comment/commentRoute';
import { reviewRoutes } from '../modules/review/reviewRoute';
import { userRoutes } from '../modules/user/userRoute';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { voteRoutes } from '../modules/vote/voteRoute';

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
        path: '/payment',
        route: PaymentRoutes,
    },
    {
        path: '/votes',
        route: voteRoutes,
    },
    {
        path: '/comments',
        route: commentRoutes,
    },
    {
        path: '/admin/dashboard-overview',
        route: AdminRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
