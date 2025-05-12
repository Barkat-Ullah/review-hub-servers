"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = require("express");
const prisma_client_1 = require("../../../prisma/generated/prisma-client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = require("../../middlewares/validate");
const commentController_1 = require("./commentController");
const commentValidation_1 = require("./commentValidation");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(prisma_client_1.User_Role.ADMIN, prisma_client_1.User_Role.USER), (0, validate_1.validate)(commentValidation_1.commentValidation.createComment), commentController_1.commentController.createComment);
router.get('/:reviewId', commentController_1.commentController.getCommentsByReviewId);
exports.commentRoutes = router;
