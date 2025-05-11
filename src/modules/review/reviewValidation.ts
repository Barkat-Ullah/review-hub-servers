import { z } from 'zod';

const createReviewValidation = z.object({
    title: z.string({ required_error: 'Title is required' }),

    description: z
        .string({ required_error: 'Description is required' })
        .min(10, 'Description must be at least 10 characters'),

    rating: z
        .number({ required_error: 'Rating is required' })
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must not exceed 5'),

    purchaseSource: z.string().optional().or(z.literal('')), // allow empty string

    imageUrls: z
        .array(z.string().url('Each image must be a valid URL'))
        .optional(),

    isPremium: z.boolean().default(false),

    premiumPrice: z
        .number({ required_error: 'Price is required for premium reviews' })
        .positive('Price must be greater than 0')
        .optional(),
    price: z
        .number({ required_error: 'Price is required for premium reviews' })
        .positive('Price must be greater than 0')
        .optional(),

    categoryId: z.string({ required_error: 'Category ID is required' }),
});

const updateReview = createReviewValidation.partial();

const rejectReview = z.object({
    reason: z
        .string()
        .min(10, 'Rejection reason must be at least 10 characters'),
});
export const reviewValidation = {
    createReviewValidation,
    updateReview,
    rejectReview,
};
