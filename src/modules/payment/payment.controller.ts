import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentServices } from './payment.service';

const createPayment = catchAsync(async (req, res) => {
    const paymentData = req.body;
    const result = await paymentServices.createPayment(
        paymentData,
        req.ip as string,
    );
    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Payment created successfully',
        data: { checkout_url: result },
    });
});
export const paymentController = {
    createPayment,
};
