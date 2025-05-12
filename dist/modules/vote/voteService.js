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
exports.voteService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_client_1 = require("../../../prisma/generated/prisma-client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const voteOnReview = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isReviewExists = yield prisma_1.default.review.findUnique({
        where: {
            id: payload.reviewId,
            status: 'PUBLISHED',
        },
    });
    if (!isReviewExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review is not found');
    }
    const existingVote = yield prisma_1.default.vote.findUnique({
        where: {
            userId_reviewId: {
                userId,
                reviewId: payload.reviewId,
            },
        },
    });
    if (!existingVote && payload.vote !== prisma_client_1.VoteType.NONE) {
        return yield prisma_1.default.vote.create({
            data: {
                reviewId: payload.reviewId,
                userId,
                vote: payload.vote,
            },
        });
    }
    if (!existingVote && payload.vote === prisma_client_1.VoteType.NONE) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Already deleted your vote');
    }
    if (existingVote && existingVote.vote === payload.vote) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Already updated your vote');
    }
    else if (existingVote && payload.vote === prisma_client_1.VoteType.NONE) {
        return yield prisma_1.default.vote.delete({
            where: {
                userId_reviewId: {
                    userId,
                    reviewId: payload.reviewId,
                },
            },
        });
    }
    yield prisma_1.default.vote.update({
        where: {
            userId_reviewId: {
                userId,
                reviewId: payload.reviewId,
            },
        },
        data: {
            vote: payload.vote,
        },
    });
    return;
});
exports.voteService = {
    voteOnReview,
};
