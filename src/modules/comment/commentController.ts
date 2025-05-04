import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { commentService } from './commentService';

const createComment = catchAsync(async (req, res) => {
    const newComment = await commentService.createComment(req.body);

    return sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Comment created successfully',
        data: newComment,
    });
});

const getCommentsByReviewId = catchAsync(async (req, res) => {
    const { reviewId } = req.params;

    const comments = await commentService.getCommentsByReviewId(reviewId);

    return sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Comments fetched successfully',
        data: comments,
    });
});

export const commentController = {
    createComment,
    getCommentsByReviewId,
};
