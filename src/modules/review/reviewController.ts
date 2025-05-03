import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { reviewHelper } from './reviewHelper';
import { reviewService, UserJWTPayload } from './reviewService';

const createReviewForUser = catchAsync(async (req, res) => {
    const { userId } = req.user as UserJWTPayload;

    let imageUrls;
    if (req.files && req.files.length) {
        imageUrls = await reviewHelper.handleImageUploads(
            req.files as Express.Multer.File[],
        );
    }

    const payload = {
        ...req.body,
        userId,
        imageUrls,
    };

    const newReview = await reviewService.createReviewForUser(
        payload,
        req.user as UserJWTPayload,
    );

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

const updateReview = catchAsync(async (req, res) => {
    const { reviewId } = req.params;

    let imageUrls;
    if (req.files && req.files.length) {
        imageUrls = await reviewHelper.handleImageUploads(
            req.files as Express.Multer.File[],
        );
    }

    const payload = {
        ...req.body,
        imageUrls,
    };

    const updatedReview = await reviewService.updateReview(
        reviewId,
        payload,
        req.user as UserJWTPayload,
    );

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Review updated successfully',
        data: updatedReview,
    });
});


export const reviewController = {
    createReviewForUser,
    getAllReviews,
    updateReview,
};
