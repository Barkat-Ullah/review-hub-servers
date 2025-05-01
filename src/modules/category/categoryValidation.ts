import { z } from 'zod';

const createValidation = z.object({
    name: z.string({ required_error: 'Name is required' }),
});

export const categoryValidation = {
    createValidation,
};
