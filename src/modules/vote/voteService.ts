import status from 'http-status';
import { VoteType } from '../../../prisma/generated/prisma-client';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

interface IVotePayload {
    reviewId: string;
    vote: VoteType;
}

const voteOnReview = async (userId: string, payload: IVotePayload) => {
    const isReviewExists = await prisma.review.findUnique({
        where: {
            id: payload.reviewId,
            status: 'PUBLISHED',
        },
    });

    if (!isReviewExists) {
        throw new AppError(status.NOT_FOUND, 'Review is not found');
    }

    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_reviewId: {
                userId,
                reviewId: payload.reviewId,
            },
        },
    });

    if (!existingVote && payload.vote !== VoteType.NONE) {
        return await prisma.vote.create({
            data: {
                reviewId: payload.reviewId,
                userId,
                vote: payload.vote,
            },
        });
    }

    if (!existingVote && payload.vote === VoteType.NONE) {
        throw new AppError(status.CONFLICT, 'Already deleted your vote');
    }

    if (existingVote && existingVote.vote === payload.vote) {
        throw new AppError(status.CONFLICT, 'Already updated your vote');
    } else if (existingVote && payload.vote === VoteType.NONE) {
        return await prisma.vote.delete({
            where: {
                userId_reviewId: {
                    userId,
                    reviewId: payload.reviewId,
                },
            },
        });
    }

    await prisma.vote.update({
        where: {
            userId_reviewId: {
                userId,
                reviewId: payload.reviewId,
            },
        },
        data: {
            vote: payload.vote,
        },
    });

    return;
};

export const voteService = {
    voteOnReview,
};
