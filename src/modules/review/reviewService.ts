/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import status from 'http-status';
import { Review, User_Role } from '../../../prisma/generated/prisma-client';
import { config } from '../../config/config';
import AppError from '../../errors/AppError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../utils/prisma';
import { reviewHelper } from './reviewHelper';

export interface UserJWTPayload {
    role: User_Role;
    userId: string;
}

type TVoteInfo = {
    isDownVote?: boolean;
    isUpVote?: boolean;
    upvotes: number;
    downvotes: number;
};

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
        select: {
            id: true,
            title: true,
            category: true,
            imageUrls: true,
            description: true,
            reasonToUnpublish: true,
            rating: true,
            status: true,
            price: true,
            isPremium: true,
            createdAt: true,
            updatedAt: true,
            votes: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    profileUrl: true,
                    email: true,
                    username: true,
                    role: true,
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

const getReviewById = async (reviewId: string, token: string | undefined) => {
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profileUrl: true,
                    email: true,
                    username: true,
                    role: true,
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
            votes: true,
        },
    });

    if (!review) {
        throw new AppError(status.NOT_FOUND, 'Review not found');
    }

    const upvotes = review.votes.filter((v) => v.vote === 'UPVOTE').length;
    const downvotes = review.votes.filter((v) => v.vote === 'DOWNVOTE').length;
    const { votes, ...reviewWithoutVotes } = review;

    const voteInfo: TVoteInfo = {
        upvotes,
        downvotes,
        isDownVote: false,
        isUpVote: false,
    };
    const isPremiumReview = review.isPremium;

    if (token) {
        const { userId, role } = jwtHelpers.verifyToken(
            token,
            config.ACCESS_TOKEN_SECRET as string,
        );

        const hasVote = review.votes.find((r) => r.userId === review.userId);
        if (hasVote) {
            voteInfo.isDownVote = hasVote.vote === 'DOWNVOTE';
            voteInfo.isUpVote = hasVote.vote === 'UPVOTE';
        }

        if (isPremiumReview && userId) {
            const { content, isLocked, preview } =
                await reviewHelper.checkReviewAccess({
                    userId,
                    reviewId,
                });

            return {
                ...reviewWithoutVotes,
                isLocked,
                preview,
                description: content,
                voteInfo,
            };
        }
    }

    return {
        ...reviewWithoutVotes,
        isLocked: review.isPremium,
        description: review.isPremium
            ? review.description.slice(0, 100)
            : review.description,
        preview: review.description.slice(0, 100),
        voteInfo,
    };
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
const approveReview = async (reviewId: string, user: UserJWTPayload) => {
    // if (user.role !== User_Role.ADMIN) {
    //   throw new AppError(
    //     status.UNAUTHORIZED,
    //     'Only admins can approve reviews'
    //   );
    // }

    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });

    if (!review) {
        throw new AppError(status.NOT_FOUND, 'Review not found');
    }

    if (review.status === 'PUBLISHED') {
        throw new AppError(status.BAD_REQUEST, 'Review is already published');
    }

    const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
            status: 'PUBLISHED',
            reasonToUnpublish: null,
        },
    });

    return updatedReview;
};

const rejectReview = async (
    reviewId: string,
    reason: string,
    user: UserJWTPayload,
) => {
    // if (user.role !== User_Role.ADMIN) {
    //   throw new AppError(
    //     status.UNAUTHORIZED,
    //     'Only admins can reject reviews'
    //   );
    // }

    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });

    if (!review) {
        throw new AppError(status.NOT_FOUND, 'Review not found');
    }

    if (review.status === 'UNPUBLISHED') {
        throw new AppError(status.BAD_REQUEST, 'Review is already unpublished');
    }

    const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
            status: 'UNPUBLISHED',
            reasonToUnpublish: reason,
        },
    });

    return updatedReview;
};

export const reviewService = {
    createReviewForUser,
    getAllReviewsFromDB,
    getReviewById,
    updateReview,
    approveReview,
    rejectReview,
};
