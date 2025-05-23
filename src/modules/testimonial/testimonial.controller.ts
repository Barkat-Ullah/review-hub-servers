import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TestimonialService } from './testimonial.service';

const createTestimonial = catchAsync(async (req, res) => {
    const newTestimonial = await TestimonialService.createTestimonial(req.body);

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'testimonial created successfully',
        data: newTestimonial,
    });
});

const getAllTestimonials = catchAsync(async (req, res) => {
    const allCategories = await TestimonialService.getAllTestimonials();

    sendResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'All testimonial fetched successfully',
        data: allCategories,
    });
});

export const testimonialController = {
    createTestimonial,
    getAllTestimonials,
};
