"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteRoutes = void 0;
const express_1 = require("express");
const prisma_client_1 = require("../../../prisma/generated/prisma-client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = require("../../middlewares/validate");
const voteController_1 = require("./voteController");
const voteValidation_1 = require("./voteValidation");
const router = (0, express_1.Router)();
router.post('/:reviewId', (0, auth_1.default)(prisma_client_1.User_Role.USER, prisma_client_1.User_Role.ADMIN), (0, validate_1.validate)(voteValidation_1.voteValidation.voteSchema), voteController_1.voteController.voteOnReview);
exports.voteRoutes = router;
