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
exports.categoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createCategoryInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existCategory = yield prisma_1.default.category.findUnique({
        where: {
            name: payload.name,
        },
    });
    if (existCategory) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Category with this name already exists.S');
    }
    const newCategory = yield prisma_1.default.category.create({
        data: payload,
    });
    return newCategory;
});
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const allCategories = yield prisma_1.default.category.findMany({
        where: {
            isDeleted: false,
        },
    });
    return allCategories;
});
const getCategoriesForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const allCategories = yield prisma_1.default.category.findMany();
    return allCategories;
});
exports.categoryService = {
    createCategoryInDB,
    getAllCategories,
    getCategoriesForAdmin,
};
