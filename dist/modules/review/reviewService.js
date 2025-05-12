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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const prisma_client_1 = require("../../../prisma/generated/prisma-client");
const config_1 = require("../../config/config");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const reviewHelper_1 = require("./reviewHelper");
const createReviewForUser = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = user || {};
    const newReview = yield prisma_1.default.review.create({
        data: {
            title: payload.title,
            description: payload.description,
            rating: payload.rating,
            purchaseSource: payload.purchaseSource,
            imageUrls: payload.imageUrls || [],
            isPremium: role === prisma_client_1.User_Role.ADMIN ? payload.isPremium : false,
            price: role === prisma_client_1.User_Role.ADMIN ? payload.price : null,
            status: role === prisma_client_1.User_Role.ADMIN ? payload.status : 'DRAFT',
            user: {
                connect: {
                    id: payload.userId,
                },
            },
            category: {
                connect: {
                    id: payload.categoryId,
                },
            },
        },
    });
    return newReview;
});
const getAllReviewsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, category, searchTerm, sortBy = 'newest', page = 1, limit = 12, } = query;
    const filters = {};
    let orderBy = { createdAt: 'desc' };
    if (rating)
        filters.rating = Number(rating);
    if (category) {
        filters.category = {
            name: {
                equals: category,
                mode: 'insensitive',
            },
        };
    }
    if (searchTerm) {
        filters.OR = [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
        ];
    }
    if (sortBy === 'oldest') {
        orderBy = { createdAt: 'asc' };
    }
    else if (sortBy === 'mostPopular') {
        orderBy = { votes: { _count: 'desc' } };
    }
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const [total, reviews] = yield Promise.all([
        prisma_1.default.review.count({ where: filters }),
        prisma_1.default.review.findMany({
            where: filters,
            orderBy,
            skip,
            take,
            select: {
                id: true,
                title: true,
                category: true,
                imageUrls: true,
                description: true,
                reasonToUnpublish: true,
                rating: true,
                status: true,
                price: true,
                isPremium: true,
                createdAt: true,
                updatedAt: true,
                votes: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileUrl: true,
                        email: true,
                        username: true,
                        role: true,
                    },
                },
            },
        }),
    ]);
    const reviewsWithCounts = reviews.map((review) => {
        const upvotes = review.votes.filter((v) => v.vote === 'UPVOTE').length;
        const downvotes = review.votes.filter((v) => v.vote === 'DOWNVOTE').length;
        const { votes } = review, rest = __rest(review, ["votes"]);
        const voteInfo = {
            upvotes,
            downvotes,
        };
        return Object.assign(Object.assign({}, rest), { voteInfo });
    });
    const totalPages = Math.ceil(total / Number(limit));
    const currentPage = Math.min(Number(page), totalPages || 1);
    return {
        meta: {
            total,
            page: currentPage,
            limit: Number(limit),
            totalPages,
        },
        data: reviewsWithCounts,
    };
});
const getReviewById = (reviewId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({
        where: {
            id: reviewId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    profileUrl: true,
                    email: true,
                    username: true,
                    role: true,
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
            votes: true,
            Comment: true,
            _count: {
                select: {
                    Comment: true,
                },
            },
        },
    });
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    const upvotes = review.votes.filter((v) => v.vote === 'UPVOTE').length;
    const downvotes = review.votes.filter((v) => v.vote === 'DOWNVOTE').length;
    const { votes, Comment, _count } = review, reviewWithoutUnnecessary = __rest(review, ["votes", "Comment", "_count"]);
    const voteInfo = {
        upvotes,
        downvotes,
        isDownVote: false,
        isUpVote: false,
    };
    const isPremiumReview = review.isPremium;
    if (token && token !== 'undefined') {
        const { userId, role } = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.config.ACCESS_TOKEN_SECRET);
        const hasVote = review.votes.find((r) => r.userId === userId);
        if (hasVote) {
            voteInfo.isDownVote = hasVote.vote === 'DOWNVOTE';
            voteInfo.isUpVote = hasVote.vote === 'UPVOTE';
        }
        if (role === 'ADMIN' || userId === review.user.id) {
            return Object.assign(Object.assign({}, reviewWithoutUnnecessary), { voteInfo, commentCount: review._count.Comment });
        }
        if (isPremiumReview && userId) {
            const { content, isLocked, preview } = yield reviewHelper_1.reviewHelper.checkReviewAccess({
                userId,
                reviewId,
            });
            return Object.assign(Object.assign({}, reviewWithoutUnnecessary), { isLocked,
                preview, description: content, voteInfo, commentCount: review._count.Comment });
        }
    }
    return Object.assign(Object.assign({}, reviewWithoutUnnecessary), { isLocked: review.isPremium, description: review.isPremium
            ? review.description.slice(0, 100)
            : review.description, preview: review.description.slice(0, 100), voteInfo, commentCount: review._count.Comment });
});
const updateReview = (reviewId, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
        include: {
            user: true,
        },
    });
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    const isOwner = review.userId === user.userId;
    const reviewCreatorRole = review.user.role;
    const requesterRole = user.role;
    const canEdit = (reviewCreatorRole === 'USER' && isOwner) ||
        (reviewCreatorRole === 'ADMIN' && requesterRole === 'ADMIN');
    if (!canEdit) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Not authorized to edit this review');
    }
    const updatedReview = yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: payload,
    });
    return updatedReview;
});
const approveReview = (reviewId, user) => __awaiter(void 0, void 0, void 0, function* () {
    // if (user.role !== User_Role.ADMIN) {
    //   throw new AppError(
    //     status.UNAUTHORIZED,
    //     'Only admins can approve reviews'
    //   );
    // }
    const review = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    if (review.status === 'PUBLISHED') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Review is already published');
    }
    const updatedReview = yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: {
            status: 'PUBLISHED',
            reasonToUnpublish: null,
        },
    });
    return updatedReview;
});
const rejectReview = (reviewId, reason, user) => __awaiter(void 0, void 0, void 0, function* () {
    // if (user.role !== User_Role.ADMIN) {
    //   throw new AppError(
    //     status.UNAUTHORIZED,
    //     'Only admins can reject reviews'
    //   );
    // }
    const review = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    if (review.status === 'UNPUBLISHED') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Review is already unpublished');
    }
    const updatedReview = yield prisma_1.default.review.update({
        where: { id: reviewId },
        data: {
            status: 'UNPUBLISHED',
            reasonToUnpublish: reason,
        },
    });
    return updatedReview;
});
exports.reviewService = {
    createReviewForUser,
    getAllReviewsFromDB,
    getReviewById,
    updateReview,
    approveReview,
    rejectReview,
};
