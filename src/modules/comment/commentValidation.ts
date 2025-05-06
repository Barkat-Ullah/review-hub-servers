import { z } from 'zod';

const createComment = z.object({
    content: z.string({ required_error: 'Content is required' }),
    reviewId: z.string({ required_error: 'ReviewId is required' }),
    parentId: z.string({ required_error: 'ParentId is required' }).optional(),
    userId: z.string().optional(),
});

export const commentValidation = {
    createComment,
};
