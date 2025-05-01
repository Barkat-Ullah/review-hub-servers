import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { categoryService } from './categoryService';

const createCategory = catchAsync(async (req, res) => {
    const newCategory = await categoryService.createCategoryInDB(req.body);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Category created successfully',
        data: newCategory,
    });
});

const getAllCategories = catchAsync(async (req, res) => {
    const allCategories = await categoryService.getAllCategories();

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Category created successfully',
        data: allCategories,
    });
});

const getCategoriesForAdmin = catchAsync(async (req, res) => {
    const allCategories = await categoryService.getCategoriesForAdmin();

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Category created successfully',
        data: allCategories,
    });
});

export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoriesForAdmin,
};
