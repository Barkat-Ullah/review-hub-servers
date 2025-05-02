/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../utils/prisma';
import { paymentUtils } from './payment.utils';

interface IPaymentData {
    userId: string;
    reviewId: string;
    amount: number;
}

const createPayment = async (paymentData: IPaymentData, client_ip: string) => {
    const { userId, reviewId, amount } = paymentData;
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });
    if (!review || !review.isPremium || !review.premiumPrice) {
        throw new Error('Invalid or non-premium review');
    }

    // Check if already paid
    const existing = await prisma.payment.findUnique({
        where: { userId_reviewId: { userId, reviewId } },
    });
    if (existing && existing.status === 'PAID') {
        throw new Error('Already purchased this review.');
    }

    const payment = await prisma.payment.create({
        data: {
            userId,
            reviewId,
            amount,
        },
    });

    const payload = {
        amount,
        order_id: payment.id,
        currency: 'BDT',
        customer_name: userData?.name,
        customer_email: userData?.email,
        customer_phone: userData?.phone,
        customer_address: userData?.address,
        customer_city: userData?.city,
        client_ip,
    };

    const response = await paymentUtils.makePaymentAsync(payload);

    // if (response && response.transactionId) {
    //     //  Added check
    //     await prisma.payment.update({
    //         where: { id: payment.id },
    //         data: {
    //             transactionId: response.transactionId,
    //             status: 'PAID',
    //         },
    //     });
    // } else {
    //     await prisma.payment.update({
    //         where: { id: payment.id },
    //         data: {
    //             status: 'UNPAID',
    //         },
    //     });
    //     throw new Error('Payment failed: Transaction ID not received.');
    // }
    return response.checkout_url;
};

export const paymentServices = {
    createPayment,
};
