import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { voteService } from './voteService';

const voteOnReview = catchAsync(async (req, res) => {
    const { userId } = req.user || {};
    const { reviewId } = req.params;

    await voteService.voteOnReview(userId, { reviewId, ...req.body });

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Vote updated successfully',
    });
});

export const voteController = {
    voteOnReview,
};
