import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { reviewService } from './reviewService';

const createReviewForUser = catchAsync(async (req, res) => {
    const newReview = await reviewService.createReviewForUser(req.body);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Review created successfully',
        data: newReview,
    });
});

const getAllReviews = catchAsync(async (req, res) => {
    const reviews = await reviewService.getAllReviewsFromDB();

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Reviews fetched successfully',
        data: reviews,
    });
});

export const reviewController = {
    createReviewForUser,
    getAllReviews,
};
