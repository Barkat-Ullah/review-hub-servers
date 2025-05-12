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
exports.commentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createComment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (payload.parentId) {
        const parent = yield prisma_1.default.comment.findUnique({
            where: { id: payload.parentId },
        });
        if (!parent) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found!');
        }
        if (parent.reviewId !== payload.reviewId) {
            throw new Error('Parent comment does not belong to this review');
        }
    }
    const newComment = yield prisma_1.default.comment.create({
        data: {
            content: payload.content,
            parentId: (_a = payload.parentId) !== null && _a !== void 0 ? _a : null,
            reviewId: payload.reviewId,
            userId: payload.userId,
        },
    });
    return newComment;
});
const getCommentsByReviewId = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield prisma_1.default.comment.findMany({
        where: {
            reviewId,
            parentId: null,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            user: {
                select: {
                    email: true,
                    name: true,
                    role: true,
                    username: true,
                    profileUrl: true,
                },
            },
            replies: {
                select: {
                    id: true,
                    content: true,
                    reviewId: true,
                    parentId: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            email: true,
                            name: true,
                            role: true,
                            username: true,
                            profileUrl: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    replies: true,
                },
            },
        },
    });
    return comments;
});
exports.commentService = {
    createComment,
    getCommentsByReviewId,
};
