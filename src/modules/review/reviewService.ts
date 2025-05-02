import { Review, User_Role } from '../../../prisma/generated/prisma-client';
import prisma from '../../utils/prisma';

export interface UserJWTPayload {
    role: User_Role;
    userId: string;
}

const createReviewForUser = async (payload: Review, user: UserJWTPayload) => {
    const { role } = user || {};
    const newReview = await prisma.review.create({
        data: {
            title: payload.title,
            description: payload.description,
            rating: payload.rating,
            purchaseSource: payload.purchaseSource,
            imageUrls: payload.imageUrls || [],
            isPremium: role === User_Role.ADMIN ? payload.isPremium : false,
            price: role === User_Role.ADMIN ? payload.price : null,
            status: role === User_Role.ADMIN ? payload.status : 'DRAFT',
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
