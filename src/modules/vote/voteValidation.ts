import { z } from 'zod';
import { VoteType } from '../../../prisma/generated/prisma-client';

const voteSchema = z.object({
    vote: z.enum([VoteType.NONE, VoteType.DOWNVOTE, VoteType.UPVOTE]),
});

export const voteValidation = {
    voteSchema,
};
