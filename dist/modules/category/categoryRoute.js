"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const prisma_client_1 = require("../../../prisma/generated/prisma-client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = require("../../middlewares/validate");
const categoryController_1 = require("./categoryController");
const categoryValidation_1 = require("./categoryValidation");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(prisma_client_1.User_Role.ADMIN), (0, validate_1.validate)(categoryValidation_1.categoryValidation.createValidation), categoryController_1.categoryController.createCategory);
router.get('/', categoryController_1.categoryController.getAllCategories);
router.get('/admin', (0, auth_1.default)(prisma_client_1.User_Role.ADMIN), categoryController_1.categoryController.getCategoriesForAdmin);
exports.categoryRoutes = router;
