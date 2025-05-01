import status from 'http-status';
import { Category } from '../../../prisma/generated/prisma-client';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

const createCategoryInDB = async (payload: Category) => {
    const existCategory = await prisma.category.findUnique({
        where: {
            name: payload.name,
        },
    });

    if (existCategory) {
        throw new AppError(
            status.CONFLICT,
            'Category with this name already exists.S',
        );
    }

    const newCategory = await prisma.category.create({
        data: payload,
    });

    return newCategory;
};

const getAllCategories = async () => {
    const allCategories = await prisma.category.findMany({
        where: {
            isDeleted: false,
        },
    });

    return allCategories;
};

const getCategoriesForAdmin = async () => {
    const allCategories = await prisma.category.findMany();

    return allCategories;
};

export const categoryService = {
    createCategoryInDB,
    getAllCategories,
    getCategoriesForAdmin,
};
