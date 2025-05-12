"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.getPopularPremiumReviewsFromDb = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getDashboardOverviewFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalReviews = yield prisma_1.default.review.count();
    const totalUsers = yield prisma_1.default.user.count();
    const totalPendingReviews = yield prisma_1.default.review.count({
        where: {
            status: 'PENDING',
        },
    });
    const totalPremiumReviews = yield prisma_1.default.review.count({
        where: {
            isPremium: true,
        },
    });
    const totalEarnings = yield prisma_1.default.payment.aggregate({
        _sum: { amount: true },
        where: {
            status: 'PAID',
        },
    });
    return {
        totalReviews,
        totalPendingReviews,
        totalPremiumReviews,
        totalPayments: totalEarnings._sum.amount || 0,
        totalUsers,
    };
});
const getPopularPremiumReviewsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prisma_1.default.review.findMany({
        where: {
            isPremium: true,
            status: 'PUBLISHED',
        },
        include: {
            _count: {
                select: {
                    votes: true,
                },
            },
        },
        orderBy: {
            votes: {
                _count: 'desc',
            },
        },
        take: 5,
    });
    return reviews.map((review) => ({
        id: review.id,
        title: review.title,
        imageUrls: review.imageUrls,
        price: review.price,
        description: review.description,
        voteCount: review._count.votes,
    }));
});
exports.getPopularPremiumReviewsFromDb = getPopularPremiumReviewsFromDb;
exports.adminService = {
    getDashboardOverviewFromDb,
    getPopularPremiumReviewsFromDb: exports.getPopularPremiumReviewsFromDb
};
