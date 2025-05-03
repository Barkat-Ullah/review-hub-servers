import { z } from 'zod';

const createComment = z.object({
    content: z.string({ required_error: 'Content is required' }),
    reviewId: z.string({ required_error: 'ReviewId is required' }),
});

export const commentValidation = {
    createComment,
};
