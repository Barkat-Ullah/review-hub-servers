/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import status from 'http-status';
import { Review, User_Role } from '../../../prisma/generated/prisma-client';
import AppError from '../../errors/AppError';
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
    const reviews = await prisma.review.findMany({
        include: {
            votes: true,
            user: {
                select: {
                    name: true,
                    username: true,
                    email: true,
                },
            },
        },
    });

    const reviewsWithCounts = reviews.map((review) => {
        const upvotes = review.votes.filter((v) => v.vote === 'UPVOTE').length;
        const downvotes = review.votes.filter(
            (v) => v.vote === 'DOWNVOTE',
        ).length;
        const { votes, ...rest } = review;

        return {
            ...rest,
            upvotes,
            downvotes,
        };
    });

    return reviewsWithCounts;
};

const updateReview = async (
    reviewId: string,
    payload: Partial<Review>,
    user: UserJWTPayload,
) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: {
            user: true,
        },
    });

    if (!review) {
        throw new AppError(status.NOT_FOUND, 'Review not found');
    }

    const isOwner = review.userId === user.userId;
    const reviewCreatorRole = review.user.role;
    const requesterRole = user.role;

    const canEdit =
        (reviewCreatorRole === 'USER' && isOwner) ||
        (reviewCreatorRole === 'ADMIN' && requesterRole === 'ADMIN');

    if (!canEdit) {
        throw new AppError(
            status.UNAUTHORIZED,
            'Not authorized to edit this review',
        );
    }

    const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: payload,
    });

    return updatedReview;
};

export const reviewService = {
    createReviewForUser,
    getAllReviewsFromDB,
    updateReview,
};
