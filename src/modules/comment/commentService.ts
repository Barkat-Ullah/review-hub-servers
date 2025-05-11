import status from 'http-status';
import { Comment } from '../../../prisma/generated/prisma-client';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

const createComment = async (payload: Comment) => {
    if (payload.parentId) {
        const parent = await prisma.comment.findUnique({
            where: { id: payload.parentId },
        });

        if (!parent) {
            throw new AppError(status.NOT_FOUND, 'Comment not found!');
        }

        if (parent.reviewId !== payload.reviewId) {
            throw new Error('Parent comment does not belong to this review');
        }
    }

    const newComment = await prisma.comment.create({
        data: {
            content: payload.content,
            parentId: payload.parentId ?? null,
            reviewId: payload.reviewId,
            userId: payload.userId,
        },
    });

    return newComment;
};

const getCommentsByReviewId = async (reviewId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            reviewId,
            parentId: null,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: {
                select: {
                    email: true,
                    name: true,
                    role: true,
                    username: true,
                },
            },
            replies: {
                select: {
                    id: true,
                    content: true,
                    reviewId: true,
                    parentId: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            email: true,
                            name: true,
                            role: true,
                            username: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    replies: true,
                },
            },
        },
    });

    return comments;
};

export const commentService = {
    createComment,
    getCommentsByReviewId,
};
