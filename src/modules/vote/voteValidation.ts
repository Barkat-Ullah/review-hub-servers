import { z } from 'zod';
import { VoteType } from '../../../generated/prisma';

const voteSchema = z.object({
    vote: z.enum([VoteType.NONE, VoteType.DOWNVOTE, VoteType.UPVOTE]),
});

export const voteValidation = {
    voteSchema,
};
