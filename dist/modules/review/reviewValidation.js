"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidation = void 0;
const zod_1 = require("zod");
const createReviewValidation = zod_1.z.object({
    title: zod_1.z.string({ required_error: 'Title is required' }),
    description: zod_1.z
        .string({ required_error: 'Description is required' })
        .min(10, 'Description must be at least 10 characters'),
    rating: zod_1.z
        .number({ required_error: 'Rating is required' })
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must not exceed 5'),
    purchaseSource: zod_1.z.string().optional().or(zod_1.z.literal('')), // allow empty string
    imageUrls: zod_1.z
        .array(zod_1.z.string().url('Each image must be a valid URL'))
        .optional(),
    isPremium: zod_1.z.boolean().default(false),
    price: zod_1.z
        .number({ required_error: 'Price is required for premium reviews' })
        .positive('Price must be greater than 0')
        .optional(),
    categoryId: zod_1.z.string({ required_error: 'Category ID is required' }),
});
const updateReview = createReviewValidation.partial();
const rejectReview = zod_1.z.object({
    reason: zod_1.z.string().min(10, 'Rejection reason must be at least 10 characters')
});
exports.reviewValidation = {
    createReviewValidation,
    updateReview,
    rejectReview
};
