"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const prisma_client_1 = require("../../../prisma/generated/prisma-client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const payment_utils_1 = require("./payment.utils");
const createPayment = (paymentData, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(paymentData);
    const { userId, reviewId } = paymentData;
    //  Step 1: Validate user
    // Step 2: Validate review
    // Step 3: Check existing payment
    // Retry failed/pending → update record
    // No record → create new
    // Call to ShurjoPay
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user = yield tx.user.findUniqueOrThrow({
            where: { id: userId },
        });
        const review = yield tx.review.findUnique({
            where: { id: reviewId },
        });
        if (!review || !review.isPremium || !review.premiumPrice) {
            throw new Error('Invalid or non-premium review');
        }
        const existingPayment = yield tx.payment.findUnique({
            where: {
                userId_reviewId: {
                    userId,
                    reviewId,
                },
            },
        });
        let payment;
        if (existingPayment) {
            if (existingPayment.status === prisma_client_1.Payment_Status.PAID) {
                throw new Error('You have already purchased this premium review.');
            }
            payment = yield tx.payment.update({
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
                    status: prisma_client_1.Payment_Status.PENDING,
                    updatedAt: new Date(),
                },
            });
        }
        else {
            payment = yield tx.payment.create({
                data: {
                    userId,
                    reviewId,
                    amount: review.premiumPrice,
                    status: prisma_client_1.Payment_Status.PENDING,
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
        const response = yield payment_utils_1.paymentUtils.makePaymentAsync(payload);
        if (response === null || response === void 0 ? void 0 : response.transactionStatus) {
            yield tx.payment.update({
                where: { id: payment.id },
                data: {
                    transactionId: (_a = response.sp_order_id) === null || _a === void 0 ? void 0 : _a.toString(),
                    transactionStatus: response.transactionStatus,
                },
            });
        }
        return {
            checkoutUrl: response === null || response === void 0 ? void 0 : response.checkout_url,
        };
    }));
    return result;
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const verifiedPayment = yield payment_utils_1.paymentUtils.verifyPaymentAsync(order_id);
    if (!Array.isArray(verifiedPayment) || verifiedPayment.length === 0) {
        throw new Error('No payment verification data found.');
    }
    const data = verifiedPayment[0];
    let status = prisma_client_1.Payment_Status.PENDING;
    switch (data.bank_status) {
        case 'Success':
            status = prisma_client_1.Payment_Status.PAID;
            break;
        case 'Failed':
            status = prisma_client_1.Payment_Status.PENDING;
            break;
        case 'Cancel':
            status = prisma_client_1.Payment_Status.UNPAID;
            break;
        default:
            status = prisma_client_1.Payment_Status.PENDING;
    }
    const payment = yield prisma_1.default.payment.findFirst({
        where: { transactionId: data.order_id },
    });
    if (!payment) {
        throw new Error('Payment record not found.');
    }
    const result = yield prisma_1.default.payment.update({
        where: { id: payment.id },
        data: {
            bank_status: data.bank_status,
            sp_code: (_a = data.sp_code) === null || _a === void 0 ? void 0 : _a.toString(),
            sp_message: data.sp_message,
            transactionStatus: (_b = data.transaction_status) !== null && _b !== void 0 ? _b : null,
            method: data.method,
            date_time: data.date_time,
            status,
        },
        include: {
            review: true,
        },
    });
    return result;
});
const getAllPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findMany({
        include: {
            user: true,
            review: true,
        },
    });
    return result;
});
const getPaymentByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findUnique({
        where: {
            id,
        },
        include: {
            review: true,
            user: true,
        },
    });
    return result;
});
exports.paymentServices = {
    createPayment,
    verifyPayment,
    getAllPayments,
    getPaymentByIdFromDB,
};
