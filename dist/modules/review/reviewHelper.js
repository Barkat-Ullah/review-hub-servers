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
exports.reviewHelper = void 0;
const cloudinary_1 = require("../../utils/cloudinary");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const handleImageUploads = (files) => __awaiter(void 0, void 0, void 0, function* () {
    if (!files || !Array.isArray(files) || files.length === 0) {
        throw new Error('At least one image file must be uploaded.');
    }
    const uploadPromises = files.map((file) => (0, cloudinary_1.uploadToCloudinary)(file.path));
    const uploadResults = yield Promise.all(uploadPromises);
    // Extract secure URLs from Cloudinary response
    return uploadResults.map((result) => result.secure_url);
});
const checkReviewAccess = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, reviewId, }) {
    const review = yield prisma_1.default.review.findUnique({
        where: { id: reviewId },
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
        },
    });
    if (!review) {
        throw new Error('REVIEW_NOT_FOUND');
    }
    let hasAccess = false;
    if (!review.isPremium) {
        hasAccess = true;
    }
    else if (userId) {
        const payment = yield prisma_1.default.payment.findFirst({
            where: {
                userId,
                reviewId,
                status: 'PAID',
            },
        });
        hasAccess = !!payment;
    }
    return {
        review,
        isLocked: review.isPremium && !hasAccess,
        content: hasAccess ? review.description : review.description.slice(0, 100),
        preview: review.description.slice(0, 100),
    };
});
exports.reviewHelper = {
    handleImageUploads,
    checkReviewAccess,
};
