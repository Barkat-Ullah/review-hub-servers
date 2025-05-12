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
exports.reviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const reviewHelper_1 = require("./reviewHelper");
const reviewService_1 = require("./reviewService");
const createReviewForUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    let imageUrls;
    if (req.files && req.files.length) {
        imageUrls = yield reviewHelper_1.reviewHelper.handleImageUploads(req.files);
    }
    const payload = Object.assign(Object.assign({}, req.body), { userId,
        imageUrls });
    const newReview = yield reviewService_1.reviewService.createReviewForUser(payload, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Review created successfully',
        data: newReview,
    });
}));
const getAllReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield reviewService_1.reviewService.getAllReviewsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Reviews fetched successfully',
        data: reviews,
    });
}));
const updateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    let imageUrls;
    if (req.files && req.files.length) {
        imageUrls = yield reviewHelper_1.reviewHelper.handleImageUploads(req.files);
    }
    const payload = Object.assign(Object.assign({}, req.body), { imageUrls });
    const updatedReview = yield reviewService_1.reviewService.updateReview(reviewId, payload, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review updated successfully',
        data: updatedReview,
    });
}));
const getReviewById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) ||
        ((_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.authorization);
    const { reviewId } = req.params;
    const review = yield reviewService_1.reviewService.getReviewById(reviewId, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review fetched successfully',
        data: review,
    });
}));
const approveReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const approvedReview = yield reviewService_1.reviewService.approveReview(reviewId, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review approved successfully',
        data: approvedReview,
    });
}));
const rejectReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const { reason } = req.body;
    const rejectedReview = yield reviewService_1.reviewService.rejectReview(reviewId, reason, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review rejected successfully',
        data: rejectedReview,
    });
}));
exports.reviewController = {
    createReviewForUser,
    getAllReviews,
    updateReview,
    getReviewById,
    approveReview,
    rejectReview,
};
