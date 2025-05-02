import { uploadToCloudinary } from '../../utils/cloudinary';

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

export const reviewHelper = {
    handleImageUploads,
};
