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
const verifyPayment = catchAsync(async (req, res) => {
    const result = await paymentServices.verifyPayment(
        req.query.order_id as string,
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Payment verified successfully',
        data: result,
    });
});

const getAllPayment = catchAsync(async (req, res) => {
    const result = await paymentServices.getAllPayments();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Successfully retrieved all payment',
        data: result,
    });
});
const getPaymentById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await paymentServices.getPaymentByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Successfully retrieved payment by id',
        data: result,
    });
});
export const paymentController = {
    createPayment,
    verifyPayment,
    getAllPayment,
    getPaymentById,
};
