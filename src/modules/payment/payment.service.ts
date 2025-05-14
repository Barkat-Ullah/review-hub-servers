/* eslint-disable @typescript-eslint/no-explicit-any */
import { Payment_Status } from '../../../prisma/generated/prisma-client';

import prisma from '../../utils/prisma';
import { paymentUtils } from './payment.utils';

interface IPaymentData {
    userId: string;
    reviewId: string;
}

const createPayment = async (paymentData: IPaymentData, client_ip: string) => {
    console.log(paymentData);
    const { userId, reviewId } = paymentData;
    //  Step 1: Validate user
    // Step 2: Validate review
    // Step 3: Check existing payment
    // Retry failed/pending → update record
    // No record → create new
    // Call to ShurjoPay

    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUniqueOrThrow({
            where: { id: userId },
        });

        const review = await tx.review.findUnique({
            where: { id: reviewId },
        });

        if (!review || !review.isPremium || !review.premiumPrice) {
            throw new Error('Invalid or non-premium review');
        }

        const existingPayment = await tx.payment.findUnique({
            where: {
                userId_reviewId: {
                    userId,
                    reviewId,
                },
            },
        });

        let payment;

        if (existingPayment) {
            if (existingPayment.status === Payment_Status.PAID) {
                throw new Error(
                    'You have already purchased this premium review.',
                );
            }

            payment = await tx.payment.update({
                where: {
                    userId_reviewId: {
                        userId,
                        reviewId,
                    },
                },
                data: {
                    amount: review.premiumPrice,
                    bank_status: null,
                    sp_code: null,
                    sp_message: null,
                    transactionStatus: null,
                    status: Payment_Status.PENDING,
                    updatedAt: new Date(),
                },
            });
        } else {
            payment = await tx.payment.create({
                data: {
                    userId,
                    reviewId,
                    amount: review.premiumPrice,
                    status: Payment_Status.PENDING,
                },
            });
        }

        const payload = {
            amount: review.premiumPrice,
            order_id: payment.id,
            currency: 'BDT',
            customer_name: user.name,
            customer_email: user.email,
            customer_phone: user.phone,
            customer_address: user.address,
            customer_city: user.city,
            client_ip,
        };

        const response = await paymentUtils.makePaymentAsync(payload);

        if (response?.transactionStatus) {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    transactionId: response.sp_order_id?.toString(),
                    transactionStatus: response.transactionStatus,
                },
            });
        }

        return {
            checkoutUrl: response?.checkout_url,
        };
    });

    return result;
};

const verifyPayment = async (order_id: string) => {
    const verifiedPayment = await paymentUtils.verifyPaymentAsync(order_id);

    if (!Array.isArray(verifiedPayment) || verifiedPayment.length === 0) {
        throw new Error('No payment verification data found.');
    }

    const data = verifiedPayment[0];

    let status: Payment_Status = Payment_Status.PENDING;

    switch (data.bank_status) {
        case 'Success':
            status = Payment_Status.PAID;
            break;
        case 'Failed':
            status = Payment_Status.PENDING;
            break;
        case 'Cancel':
            status = Payment_Status.UNPAID;
            break;
        default:
            status = Payment_Status.PENDING;
    }

    const payment = await prisma.payment.findFirst({
        where: { transactionId: data.order_id },
    });

    if (!payment) {
        throw new Error('Payment record not found.');
    }

    const result = await prisma.payment.update({
        where: { id: payment.id },
        data: {
            bank_status: data.bank_status,
            sp_code: data.sp_code?.toString(),
            sp_message: data.sp_message,
            transactionStatus: data.transaction_status ?? null,
            method: data.method,
            date_time: data.date_time,
            status,
        },
        include: {
            review: true,
        },
    });

    return result;
};

const getAllPayments = async () => {
    const result = await prisma.payment.findMany({
        include: {
            user: true,
            review: true,
        },
    });
    return result;
};
const getPaymentByIdFromDB = async (id: string) => {
    const result = await prisma.payment.findUnique({
        where: {
            id,
        },
        include: {
            review: true,
            user: true,
        },
    });
    return result;
};
const getMyPayment = async (userId: string) => {
    const result = await prisma.payment.findMany({
        where: {
            userId,
            status: Payment_Status.PAID,
        },
        include: {
            review: true,
            user: true,
        },
    });
    return result;
};

export const paymentServices = {
    createPayment,
    verifyPayment,
    getAllPayments,
    getPaymentByIdFromDB,
    getMyPayment,
};
