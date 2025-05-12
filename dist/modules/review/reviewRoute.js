"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const prisma_client_1 = require("../../../prisma/generated/prisma-client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const multer_1 = require("../../middlewares/multer");
const validate_1 = require("../../middlewares/validate");
const reviewController_1 = require("./reviewController");
const reviewValidation_1 = require("./reviewValidation");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(prisma_client_1.User_Role.USER, prisma_client_1.User_Role.ADMIN), multer_1.upload.array('imageUrls'), (0, validate_1.validate)(reviewValidation_1.reviewValidation.createReviewValidation), reviewController_1.reviewController.createReviewForUser);
router.get('/', reviewController_1.reviewController.getAllReviews);
router.get('/:reviewId', reviewController_1.reviewController.getReviewById);
router.put('/:reviewId', multer_1.upload.array('imageUrls'), (0, auth_1.default)(prisma_client_1.User_Role.USER, prisma_client_1.User_Role.ADMIN), (0, validate_1.validate)(reviewValidation_1.reviewValidation.updateReview));
router.patch('/:reviewId/approve', 
// auth(User_Role.ADMIN),
reviewController_1.reviewController.approveReview);
router.patch('/:reviewId/reject', 
// auth(User_Role.ADMIN),
(0, validate_1.validate)(reviewValidation_1.reviewValidation.rejectReview), reviewController_1.reviewController.rejectReview);
exports.reviewRoutes = router;
