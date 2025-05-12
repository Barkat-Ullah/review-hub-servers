"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_routes_1 = require("../modules/admin/admin.routes");
const authRoute_1 = require("../modules/auth/authRoute");
const categoryRoute_1 = require("../modules/category/categoryRoute");
const commentRoute_1 = require("../modules/comment/commentRoute");
const reviewRoute_1 = require("../modules/review/reviewRoute");
const userRoute_1 = require("../modules/user/userRoute");
const payment_route_1 = require("../modules/payment/payment.route");
const voteRoute_1 = require("../modules/vote/voteRoute");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: authRoute_1.AuthRoutes,
    },
    {
        path: '/users',
        route: userRoute_1.userRoutes,
    },
    {
        path: '/categories',
        route: categoryRoute_1.categoryRoutes,
    },
    {
        path: '/reviews',
        route: reviewRoute_1.reviewRoutes,
    },
    {
        path: '/payment',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/votes',
        route: voteRoute_1.voteRoutes,
    },
    {
        path: '/comments',
        route: commentRoute_1.commentRoutes,
    },
    {
        path: '/admin/dashboard-overview',
        route: admin_routes_1.AdminRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
