import prisma from '../../utils/prisma';

const getDashboardOverviewFromDb = async () => {
    // Simulate a database call
    const totalReviews = await prisma.review.count();
    const totalUsers = await prisma.user.count();
    const totalPendingReviews = await prisma.review.count({
        where: {
            status: 'PENDING',
        },
    });

    const totalPremiumReviews = await prisma.review.count({
        where: {
            isPremium: true,
        },
    });

    const totalEarnings = await prisma.payment.aggregate({
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
};

export const adminService = {
    getDashboardOverviewFromDb,
};
