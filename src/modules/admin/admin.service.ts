import prisma from '../../utils/prisma';

const getDashboardOverviewFromDb = async () => {
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


export const getPopularPremiumReviewsFromDb = async () => {
    const reviews = await prisma.review.findMany({
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
  };
  
  
export const adminService = {
    getDashboardOverviewFromDb,
    getPopularPremiumReviewsFromDb
};
