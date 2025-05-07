import { uploadToCloudinary } from '../../utils/cloudinary';
import prisma from '../../utils/prisma';

const handleImageUploads = async (
    files: Express.Multer.File[],
): Promise<string[]> => {
    if (!files || !Array.isArray(files) || files.length === 0) {
        throw new Error('At least one image file must be uploaded.');
    }

    const uploadPromises = files.map((file) => uploadToCloudinary(file.path));
    const uploadResults = await Promise.all(uploadPromises);

    // Extract secure URLs from Cloudinary response
    return uploadResults.map((result) => result.secure_url);
};

const checkReviewAccess = async ({
    userId,
    reviewId,
}: {
    userId: string | null | undefined;
    reviewId: string;
}) => {
    const review = await prisma.review.findUnique({
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
    } else if (userId) {
        const payment = await prisma.payment.findFirst({
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
        content: hasAccess ? review.description : null,
        preview: review.description.slice(0, 100),
    };
};

export const reviewHelper = {
    handleImageUploads,
    checkReviewAccess,
};
