import { Review } from '../../../prisma/generated/prisma-client';
import prisma from '../../utils/prisma';

const createReviewForUser = async (payload: Review) => {
    const newReview = await prisma.review.create({
        data: {
            title: payload.title,
            description: payload.description,
            rating: payload.rating,
            purchaseSource: payload.purchaseSource,
            imageUrls: payload.imageUrls || [],
            isPremium: false,
            price: payload.isPremium ? payload.price : null,
            user: {
                connect: {
                    id: payload.userId,
                },
            },
            category: {
                connect: {
                    id: payload.categoryId,
                },
            },
        },
    });

    return newReview;
};

const getAllReviewsFromDB = async () => {
    const reviews = await prisma.review.findMany();
    return reviews;
};

export const reviewService = {
    createReviewForUser,
    getAllReviewsFromDB,
};
