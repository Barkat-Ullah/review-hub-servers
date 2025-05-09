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
    const reviews = await reviewService.getAllReviewsFromDB(req.query);

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

const getReviewById = catchAsync(async (req, res) => {
    const token =
        req.headers['authorization']?.split(' ')[1] ||
        req?.headers?.authorization;

    const { reviewId } = req.params;

    const review = await reviewService.getReviewById(reviewId, token);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Review fetched successfully',
        data: review,
    });
});

const approveReview = catchAsync(async (req, res) => {
    const { reviewId } = req.params;

    const approvedReview = await reviewService.approveReview(
        reviewId,
        req.user as UserJWTPayload,
    );

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Review approved successfully',
        data: approvedReview,
    });
});

const rejectReview = catchAsync(async (req, res) => {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const rejectedReview = await reviewService.rejectReview(
        reviewId,
        reason,
        req.user as UserJWTPayload,
    );

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Review rejected successfully',
        data: rejectedReview,
    });
});
export const reviewController = {
    createReviewForUser,
    getAllReviews,
    updateReview,
    getReviewById,
    approveReview,
    rejectReview,
};
