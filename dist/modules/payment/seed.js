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
exports.seedReviews = exports.seedCategories = exports.seedUser = void 0;
const prisma_client_1 = require("../../../prisma/generated/prisma-client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const seedUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminUser = {
            email: 'user@example.com',
            password: '123456',
            name: 'user',
            username: 'user',
            role: prisma_client_1.User_Role.USER,
            phone: 'N/A',
            address: 'N/A',
            city: 'N/A',
            state: 'N/A',
            postcode: 'N/A',
        };
        yield prisma_1.default.user.create({
            data: adminUser,
        });
        console.log('Admin user seeded successfully.');
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
    }
});
exports.seedUser = seedUser;
const seedCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoriesData = [
            { name: 'Electronics' },
            { name: 'Clothing' },
            { name: 'Home Goods' },
            { name: 'Books' },
            { name: 'Sports' },
            { name: 'Toys' },
            { name: 'Furniture' },
            { name: 'Appliances' },
            { name: 'Beauty' },
            { name: 'Automotive' },
        ];
        for (const categoryData of categoriesData) {
            // Check if the category already exists to avoid duplicates
            const existingCategory = yield prisma_1.default.category.findUnique({
                where: { name: categoryData.name },
            });
            if (!existingCategory) {
                yield prisma_1.default.category.create({
                    data: categoryData,
                });
            }
            else {
                console.log(`Category "${categoryData.name}" already exists.`);
            }
        }
        console.log('Categories seeded successfully.');
    }
    catch (error) {
        console.error('Error seeding categories:', error);
    }
});
exports.seedCategories = seedCategories;
const seedReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // First, make sure there is at least one user and one category.
        const user = yield prisma_1.default.user.findFirst();
        const category = yield prisma_1.default.category.findFirst();
        if (!user) {
            console.warn('No user found. Please seed a user first.');
            return; // Or throw an error if a user is absolutely required
        }
        if (!category) {
            console.warn('No category found. Please seed a category first.');
            return; // Or throw an error if a category is absolutely required
        }
        const reviewsData = [
            {
                title: 'Great Product Review',
                description: 'This product is amazing!  It works really well and I highly recommend it.',
                rating: 5,
                userId: user.id,
                categoryId: category.id,
                status: prisma_client_1.Review_Status.PUBLISHED,
                isPremium: false,
            },
            {
                title: 'Okay Product Review',
                description: 'This product was okay.  It had some good points, but also some bad ones.',
                rating: 3,
                userId: user.id,
                categoryId: category.id,
                status: prisma_client_1.Review_Status.PUBLISHED,
                isPremium: true,
                premiumPrice: 100,
            },
            {
                title: 'Bad Product Review',
                description: 'I was very disappointed in this product.  It did not work as advertised.',
                rating: 1,
                userId: user.id,
                categoryId: category.id,
                status: prisma_client_1.Review_Status.DRAFT,
                isPremium: false,
            },
            {
                title: 'Premium Review Example',
                description: 'A detailed review for premium users.  Explains all features.',
                rating: 5,
                userId: user.id,
                categoryId: category.id,
                status: prisma_client_1.Review_Status.PUBLISHED,
                isPremium: true,
                premiumPrice: 250,
                purchaseSource: 'Online Store',
                imageUrls: [
                    'https://example.com/image1.jpg',
                    'https://example.com/image2.jpg',
                ],
            },
            {
                title: 'Another Great Review',
                description: 'Another fantastic product.  I would buy it again.',
                rating: 4,
                userId: user.id,
                categoryId: category.id,
                status: prisma_client_1.Review_Status.PUBLISHED,
                isPremium: false,
                purchaseSource: 'Retail Store',
                imageUrls: ['https://example.com/image3.jpg'],
            },
            {
                title: 'Decent Product',
                description: 'It is a decent product, serves the purpose.',
                rating: 3,
                userId: user.id,
                categoryId: category.id,
                status: prisma_client_1.Review_Status.PUBLISHED,
                isPremium: false,
            },
            {
                title: 'Not Recommended',
                description: 'I cannot recommend this product.  It has many issues.',
                rating: 2,
                userId: user.id,
                categoryId: category.id,
                status: prisma_client_1.Review_Status.DRAFT,
                isPremium: false,
            },
            {
                title: 'Premium Feature Review',
                description: 'A review highlighting the premium features, with comparisons.',
                rating: 4,
                userId: user.id,
                categoryId: category.id,
                status: prisma_client_1.Review_Status.PUBLISHED,
                isPremium: true,
                premiumPrice: 300,
                purchaseSource: 'Website',
                imageUrls: [
                    'https://example.com/premium1.jpg',
                    'https://example.com/premium2.jpg',
                    'https://example.com/premium3.jpg',
                ],
            },
            {
                title: 'Best Value Product',
                description: 'This product offers the best value for the money.',
                rating: 5,
                userId: user.id,
                categoryId: category.id,
                status: prisma_client_1.Review_Status.PUBLISHED,
                isPremium: false,
            },
            {
                title: 'Average Product Experience',
                description: 'My experience with this product was average.',
                rating: 3,
                userId: user.id,
                categoryId: category.id,
                status: prisma_client_1.Review_Status.DRAFT,
                isPremium: false,
            },
        ];
        for (const reviewData of reviewsData) {
            yield prisma_1.default.review.create({
                data: reviewData,
            });
        }
        console.log('Reviews seeded successfully.');
    }
    catch (error) {
        console.error('Error seeding reviews:', error);
    }
});
exports.seedReviews = seedReviews;
