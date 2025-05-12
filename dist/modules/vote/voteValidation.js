"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteValidation = void 0;
const zod_1 = require("zod");
const prisma_client_1 = require("../../../prisma/generated/prisma-client");
const voteSchema = zod_1.z.object({
    vote: zod_1.z.enum([prisma_client_1.VoteType.NONE, prisma_client_1.VoteType.DOWNVOTE, prisma_client_1.VoteType.UPVOTE]),
});
exports.voteValidation = {
    voteSchema,
};
